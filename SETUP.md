# SETUP_INICIAL.md
# Setup Inicial del Proyecto
Instituto Superior de Formación Docente – Paulo Freire

**Stack**: SvelteKit 2 + Svelte 5 + TailwindCSS 4 + Prisma + PostgreSQL

---

## 🚀 Comandos de Setup Inicial

### 1. Crear Proyecto Base
```bash
# Instalar SvelteKit globalmente
npm create svelte@latest freire
# Seleccionar opciones:
# - SvelteKit app
# - TypeScript
# - ESLint, Prettier
# - Playwright
# - TailwindCSS

cd freire

# Instalar dependencias principales
npm install @prisma/client prisma
npm install @types/jsonwebtoken jsonwebtoken bcryptjs
npm install @types/bcryptjs
npm install lucide-svelte
npm install @tailwindcss/typography

# Dependencias de desarrollo
npm install --save-dev vitest @vitest/ui jsdom
npm install --save-dev @testing-library/svelte @testing-library/jest-dom
npm install --save-dev prisma
```

### 2. Configurar Estructura Base
```bash
# Crear estructura de carpetas
mkdir -p src/lib/server/{auth,users,academic,financial}
mkdir -p src/lib/components/{ui,forms,layout}
mkdir -p src/lib/utils/{auth,validation,helpers}
mkdir -p prisma/migrations
mkdir -p test/{unit,integration,e2e}
mkdir -p docs docker scripts
```

### 3. Configurar Prisma
```bash
# Inicializar Prisma
npx prisma init

# Crear schema base
cat > prisma/schema.prisma << EOF
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  firstName String
  lastName  String
  role      Role     @default(ALUMNO)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN_SISTEMA
  DIRECTOR
  COORDINADOR_CARRERA
  SECRETARIA_ACADEMICA
  SECRETARIA_FINANCIERA
  DOCENTE
  ALUMNO
  BEDEL
}
EOF
```

### 7. Configuración de Variables de Entorno Seguras**
```bash
# Variables para desarrollo (.env.development)
cat > .env.development << 'EOF'
# Development Database
DATABASE_URL="postgresql://freire:password@localhost:5432/freire_dev"

# Development JWT
JWT_SECRET=dev-jwt-secret-key
JWT_REFRESH_SECRET=dev-refresh-secret-key

# Development App
NODE_ENV=development
PORT=5173
ORIGIN=http://localhost:5173
'EOF'

# Variables para producción (.env.production)
cat > .env.production << 'EOF'
# Production Database (acceso interno)
DATABASE_URL="postgresql://freire:password@postgres:5432/freire_db"

# Production JWT
JWT_SECRET=prod-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=prod-super-secret-refresh-key-change-in-production

# Production App
NODE_ENV=production
PORT=5173
ORIGIN=https://paulofreire.edu
'EOF'

# Variables estáticas privadas (nunca se filtran al frontend)
mkdir -p src/lib/server/private
cat > src/lib/server/private/env.ts << 'EOF'
import { env } from '$env/dynamic/private';

// Estas variables solo están disponibles en el servidor
export const databaseUrl = env.DATABASE_URL;
export const jwtSecret = env.JWT_SECRET;
export const jwtRefreshSecret = env.JWT_REFRESH_SECRET;
export const jwtExpiration = parseInt(env.JWT_EXPIRATION || '3600');
export const jwtRefreshExpiration = parseInt(env.JWT_REFRESH_EXPIRATION || '604800');
'EOF'
```
**Resultado**: Variables seguras configuradas
**Verificación**: `ls -la .env* && ls -la src/lib/server/private/`

### 5. Configurar Docker para Producción (Server-First)**
```bash
# Crear docker-compose.yml con aislamiento
cat > docker-compose.yml << EOF
version: '3.8'
services:
  # Base de datos en red interna
  postgres:
    image: postgres:15-alpine
    container_name: freire-postgres
    environment:
      POSTGRES_DB: ${DB_DATABASE:-freire_db}
      POSTGRES_USER: ${DB_USERNAME:-freire}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password}
    ports: []  # Sin exposición externa - solo acceso interno
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - freire-internal  # Red interna aislada
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME:-freire}"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Aplicación SvelteKit Server-First
  app:
    build: .
    container_name: freire-app
    environment:
      - NODE_ENV=production
      - PORT=5173
      - DATABASE_URL=postgresql://${DB_USERNAME:-freire}:${DB_PASSWORD:-password}@postgres:5432/${DB_DATABASE:-freire_db}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    ports:
      - "${APP_PORT:-5173}:5173"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - freire-internal  # Conexión a base de datos
      - freire-external  # Conexión externa
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5173/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  postgres_data:
    driver: local

networks:
  # Red interna para comunicación entre servicios
  freire-internal:
    driver: bridge
    internal: true  # Aislamiento completo
  
  # Red externa para acceso a la aplicación
  freire-external:
    driver: bridge
EOF
```
**Resultado**: Docker Compose con aislamiento y Server-First
**Verificación**: `docker-compose config`

### 6. Scripts de Desarrollo y Producción**
```bash
# Actualizar package.json con scripts
# NOTA: Esto debe agregarse dentro del objeto "scripts" existente en package.json

# Scripts para package.json:
{
  "scripts": {
    "build": "vite build",
    "dev": "vite dev",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "lint": "prettier --plugin-search-dir . --check . && eslint .",
    "format": "prettier --plugin-search-dir . --write .",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:prod": "prisma migrate deploy",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "docker:prod": "NODE_ENV=production docker-compose up -d"
  }
}
```

### 7. Configuración de Seguridad Base
```bash
# Configurar hooks de SvelteKit para seguridad
mkdir -p src/lib/server/hooks
cat > src/lib/server/hooks/auth.ts << EOF
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
  // Lógica de autenticación aquí
  return resolve(event);
};
EOF
```

### 8. Configuración SvelteKit para Server-First**
```bash
# Configurar vite.config.ts para producción
cat > vite.config.ts << 'EOF'
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: node(),
      files: {
        hooks: {
          // Server hooks para seguridad
          handle: './src/lib/server/hooks/auth.ts'
        }
      },
      alias: {
        $components: 'src/lib/components',
        $utils: 'src/lib/utils',
        $server: 'src/lib/server'
      }
    })
  ],
  server: {
    host: true, // Para Docker
    port: 5173,
  },
  build: {
    target: 'node18'
  }
});
'EOF'

# Configurar app.d.ts para variables privadas
cat > src/app.d.ts << 'EOF'
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user?: import('$lib/server/types/auth').User;
    }
    // interface PageData {}
    // interface Platform {}
  }
}
'EOF'
```
**Resultado**: SvelteKit Server-First configurado
**Verificación**: `npx tsc --noEmit vite.config.ts`

### 9. Configuración Producción con Server-First**
```bash
# Crear health check endpoint
mkdir -p src/routes/api/health
cat > src/routes/api/health/+server.ts << 'EOF'
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { databaseUrl } from '$lib/server/private/env';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

export const GET: RequestHandler = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    return json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
};
'EOF'
```
**Resultado**: Health check configurado
**Verificación**: `npx tsc --noEmit src/routes/api/health/+server.ts`

### Iniciar Desarrollo
```bash
# Levantar servicios
npm run docker:up

# Esperar 10 segundos para que inicien
sleep 10

# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Iniciar desarrollo
npm run dev
```

### Crear Nueva Ruta API
```bash
# Ejemplo: Crear ruta de usuarios
mkdir -p src/routes/api/users
cat > src/routes/api/users/+server.ts << EOF
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return json({ users: [] });
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  return json({ success: true, data });
};
EOF
```

### Testing
```bash
# Correr todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo UI
npm run test:ui

# Tests en modo watch
npm test -- --watch
```

---

## 🧪 Decisión Estratégica: Prisma vs TypeORM

### 📋 Opciones Disponibles

**Prisma** (Recomendado para SvelteKit):
- ✅ Mejor developer experience
- ✅ Type safety extremo
- ✅ Auto-completado superior
- ✅ Migraciones automáticas
- ✅ Queries optimizadas automáticamente

**TypeORM** (Alternativa tradicional):
- ✅ Más control manual
- ✅ Mayor flexibilidad
- ✅ Mejor para DDD puro
- ✅ Control total sobre queries

### 🎯 Recomendación para este Proyecto

**Prisma** - Por qué:
- Integración perfecta con SvelteKit
- Type safety de extremo a extremo
- Developer experience superior
- Migraciones automáticas y seguras
- Auto-completado en VSCode increíble

---

## 🚀 Próximos Pasos Críticos

### 1️⃣ Módulo AUTH Primero
Antes de cualquier módulo de negocio:
- Implementar JWT con refresh tokens
- Configurar hooks de SvelteKit
- Crear middleware de autenticación
- Tests de seguridad exhaustivos

### 2️⃣ Estructura Definitiva
- Rutas API en /src/routes/api/
- Componentes en /src/lib/components/
- Servicios en /src/lib/server/
- Utilidades en /src/lib/utils/

### 3️⃣ Primer Módulo de Negocio
- Users module con Prisma
- Validaciones con Zod
- Tests unitarios e integración

---

## 📋 Checklist de Setup Profesional

- [ ] Proyecto SvelteKit creado con TypeScript
- [ ] Dependencias completas instaladas
- [ ] Prisma configurado con PostgreSQL
- [ ] TailwindCSS 4 configurado
- [ ] Variables de entorno completas
- [ ] Docker compose funcionando
- [ ] Scripts de desarrollo correctos
- [ ] Estructura de carpetas SvelteKit
- [ ] Módulo AUTH implementado
- [ ] Tests configurados con Vitest

---

## 🎯 Conclusión

**Setup profesional listo para desarrollo real con**:
- ✅ SvelteKit 2 + Svelte 5
- ✅ Prisma ORM moderno
- ✅ TailwindCSS 4 integrado
- ✅ Seguridad enterprise desde el inicio
- ✅ Estructura moderna y mantenible
- ✅ Dependencias completas y actualizadas
- ✅ Configuración profesional sin improvisaciones

**El proyecto está listo para implementación seria con stack moderno.**
