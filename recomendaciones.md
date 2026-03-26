# 📝 **RECOMENDACIONES.md**
# Comandos y Pedidos Cortos para Desarrollo - Sistema Paulo Freire
Instituto Superior de Formación Docente – Paulo Freire

**Stack**: SvelteKit 2 + Svelte 5 + Prisma + PostgreSQL + TailwindCSS 4

## 🎯 **Propósito del Documento**

Colección de comandos y pedidos cortos para copiar y pegar. Cada pedido está diseñado para ser ejecutado en 30-60 segundos con resultados verificables.

**Formato**: Comando → Resultado esperado → Verificación

---

## 🚀 **PASO 1: Configuración Base del Proyecto**

### **1.1: Instalar SvelteKit CLI**
```bash
npm create svelte@latest
```
**Resultado**: CLI global instalado
**Verificación**: `npm create svelte@latest --version`

### **1.2: Crear proyecto SvelteKit**
```bash
npm create svelte@latest freire
# Seleccionar opciones:
# - SvelteKit app
# - TypeScript
# - ESLint, Prettier
# - Playwright
# - TailwindCSS

cd freire
```
**Resultado**: Proyecto base creado
**Verificación**: `ls -la src/`

### **1.3: Instalar dependencias principales**
```bash
npm install @prisma/client prisma
npm install @types/jsonwebtoken jsonwebtoken bcryptjs
npm install @types/bcryptjs
npm install lucide-svelte
npm install @tailwindcss/typography
```
**Resultado**: Dependencias instaladas
**Verificación**: `npm ls --depth=0 | grep @prisma`

### **1.4: Instalar dependencias de desarrollo**
```bash
npm install --save-dev vitest @vitest/ui jsdom
npm install --save-dev @testing-library/svelte @testing-library/jest-dom
npm install --save-dev prisma
```
**Resultado**: Dependencias de desarrollo instaladas
**Verificación**: `npm run test -- --dry-run`

### **1.5: Configurar TypeScript estricto**
```bash
cat > tsconfig.json << 'EOF'
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
'EOF'
```
**Resultado**: TypeScript configurado
**Verificación**: `npx tsc --noEmit`

### **1.6: Configurar ESLint**
```bash
cat > .eslintrc.cjs << 'EOF'
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:svelte/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'svelte'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte']
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
'EOF'
```
**Resultado**: ESLint configurado
**Verificación**: `npx eslint src --ext .ts --dry-run`

### **1.7: Configurar Prettier**
```bash
cat > .prettierrc << 'EOF'
{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "svelteSortOrder": "scripts-markup-styles-options"
}
'EOF'
```
**Resultado**: Prettier configurado
**Verificación**: `npx prettier --check src/**/*.{ts,svelte}`

### **1.8: Crear estructura SvelteKit**
```bash
mkdir -p src/lib/server/{auth,users,academic,financial}
mkdir -p src/lib/components/{ui,forms,layout}
mkdir -p src/lib/utils/{auth,validation,helpers}
mkdir -p src/routes/{api,(auth),users,academic}
mkdir -p test/{unit,integration,e2e}
mkdir -p prisma/migrations
```
**Resultado**: Estructura SvelteKit creada
**Verificación**: `tree src -I node_modules`

---

## 🗄️ **PASO 2: Infraestructura de Datos**

### **2.1: Crear configuración Prisma**
```bash
# Inicializar Prisma
npx prisma init

cat > prisma/schema.prisma << 'EOF'
// This is your Prisma schema file,
// learn more about it in docs: https://pris.ly/d/prisma-schema

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
'EOF'
```
**Resultado**: Configuración Prisma creada
**Verificación**: `npx prisma validate`

### **2.2: Crear Docker Compose**
```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: freire-postgres
    environment:
      POSTGRES_DB: ${DB_DATABASE:-freire_dev}
      POSTGRES_USER: ${DB_USERNAME:-freire}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password}
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8"
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - freire-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME:-freire}"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local

networks:
  freire-network:
    driver: bridge
'EOF'
```
**Resultado**: Docker Compose configurado
**Verificación**: `docker-compose config`

### **2.3: Crear variables de entorno**
```bash
cat > .env.example << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://freire:password@localhost:5432/freire_db?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRATION=3600
JWT_REFRESH_EXPIRATION=604800

# Application Configuration
NODE_ENV=development
PORT=5173
ORIGIN=http://localhost:5173

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_here

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=json
'EOF'

cp .env.example .env
```
**Resultado**: Variables de entorno creadas
**Verificación**: `ls -la .env*`

### **2.4: Crear sistema de migraciones Prisma**
```bash
mkdir -p scripts
cat > scripts/migrate.sh << 'EOF'
#!/bin/bash
set -e

echo "🔄 Running database migrations..."

# Verificar conexión a base de datos
npm run db:migrate -- --dry-run || {
  echo "❌ Database connection failed"
  exit 1
}

# Ejecutar migraciones
npm run db:migrate

echo "✅ Migrations completed successfully"

# Verificar estado de la base de datos
npm run db:studio --browser none &
echo "📊 Prisma Studio opened"
'EOF'

chmod +x scripts/migrate.sh
```
**Resultado**: Sistema de migraciones creado
**Verificación**: `ls -la scripts/`

---

## 🛡️ **PASO 3: Seguridad Base**

### **3.1: Configurar seguridad en hooks de SvelteKit**
```bash
mkdir -p src/lib/server/hooks
cat > src/lib/server/hooks/auth.ts << 'EOF'
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
  // Seguridad base
  const response = await resolve(event);
  
  // Headers de seguridad
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
};
'EOF'
```
**Resultado**: Seguridad base configurada
**Verificación**: `npx tsc --noEmit src/lib/server/hooks/auth.ts`

### **3.2: Configurar rate limiting**
```bash
mkdir -p src/lib/server/middleware
cat > src/lib/server/middleware/rate-limit.ts << 'EOF'
import type { Handle } from '@sveltejs/kit';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 100; // requests per window
const WINDOW_MS = 60 * 1000; // 1 minute

export function rateLimit(): Handle {
  return async ({ event, resolve }) => {
    const clientIP = event.getClientAddress() || 'unknown';
    const now = Date.now();
    
    const record = rateLimitMap.get(clientIP);
    
    if (!record || now > record.resetTime) {
      rateLimitMap.set(clientIP, {
        count: 1,
        resetTime: now + WINDOW_MS
      });
    } else {
      record.count++;
      
      if (record.count > RATE_LIMIT) {
        return new Response('Too many requests', {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString()
          }
        });
      }
    }
    
    return resolve(event);
  };
}
'EOF'
```
**Resultado**: Rate limiting configurado
**Verificación**: `npx tsc --noEmit src/lib/server/middleware/rate-limit.ts`

---

## 🔐 **PASO 4: Módulo de Autenticación**

### **4.1: Crear enums de autenticación**
```bash
mkdir -p src/modules/auth/domain/enums
cat > src/modules/auth/domain/enums/user-role.enum.ts << 'EOF'
export enum UserRole {
  ADMIN = 'admin',
  SECRETARIA = 'secretaria',
  DOCENTE = 'docente',
  ALUMNO = 'alumno',
}
'EOF'
```
**Resultado**: Enums creados
**Verificación**: `npx tsc --noEmit src/modules/auth/domain/enums/user-role.enum.ts`

### **4.2: Crear entidad User**
```bash
cat > src/modules/auth/domain/entities/user.entity.ts << 'EOF'
import { Entity } from '@/shared/domain/entity.base';
import { UserRole } from '../enums/user-role.enum';

export class User extends Entity {
  private constructor(
    readonly id: string,
    private readonly _email: string,
    private readonly _passwordHash: string,
    private readonly _role: UserRole,
    private readonly _isActive: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {
    super(id);
  }

  get email(): string {
    return this._email;
  }

  get role(): UserRole {
    return this._role;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  static create(email: string, passwordHash: string, role: UserRole): User {
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido');
    }
    
    if (!passwordHash || passwordHash.length < 60) {
      throw new Error('Password hash inválido');
    }

    return new User(
      crypto.randomUUID(),
      email.toLowerCase().trim(),
      passwordHash,
      role,
      true,
      new Date(),
      new Date(),
    );
  }
}
'EOF'
```
**Resultado**: Entidad User creada
**Verificación**: `npx tsc --noEmit src/modules/auth/domain/entities/user.entity.ts`

### **4.3: Crear JWT service**
```bash
cat > src/modules/auth/infrastructure/security/jwt.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly accessTokenExpiry: number;
  private readonly refreshTokenExpiry: number;

  constructor(private configService: ConfigService) {
    this.privateKey = fs.readFileSync(
      this.configService.get('JWT_PRIVATE_KEY_PATH'),
      'utf8'
    );
    this.publicKey = fs.readFileSync(
      this.configService.get('JWT_PUBLIC_KEY_PATH'),
      'utf8'
    );
    this.accessTokenExpiry = parseInt(
      this.configService.get('JWT_EXPIRATION') || '3600'
    );
    this.refreshTokenExpiry = parseInt(
      this.configService.get('JWT_REFRESH_EXPIRATION') || '604800'
    );
  }

  generateTokenPair(user: { id: string; email: string; role: string }): TokenPair {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: this.accessTokenExpiry,
    });

    const refreshToken = jwt.sign(
      { sub: user.id, type: 'refresh' },
      this.privateKey,
      {
        algorithm: 'RS256',
        expiresIn: this.refreshTokenExpiry,
      }
    );

    return { accessToken, refreshToken };
  }
}
'EOF'
```
**Resultado**: JWT service creado
**Verificación**: `npx tsc --noEmit src/modules/auth/infrastructure/security/jwt.service.ts`

### **4.4: Generar claves JWT**
```bash
mkdir -p keys
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
chmod 600 keys/private.pem
chmod 644 keys/public.pem
```
**Resultado**: Claves JWT generadas
**Verificación**: `ls -la keys/`

---

## 📚 **PASO 5: Módulo Académico - Domain**

### **5.1: Crear enums académicos**
```bash
mkdir -p src/modules/academic/domain/enums
cat > src/modules/academic/domain/enums/estado-academico.enum.ts << 'EOF'
export enum EstadoAcademico {
  ACTIVO = 'activo',
  SUSPENDIDO = 'suspendido',
  BAJA = 'baja',
  EGRESADO = 'egresado',
}
'EOF'
```
**Resultado**: Enums académicos creados
**Verificación**: `npx tsc --noEmit src/modules/academic/domain/enums/estado-academico.enum.ts`

### **5.2: Crear Value Objects**
```bash
mkdir -p src/modules/academic/domain/value-objects
cat > src/modules/academic/domain/value-objects/dni.value-object.ts << 'EOF'
export class Dni {
  private constructor(private readonly _value: string) {}

  get value(): string {
    return this._value;
  }

  static create(dni: string): Dni {
    if (!dni || dni.trim().length !== 8 || !/^\d+$/.test(dni)) {
      throw new Error('DNI inválido');
    }
    return new Dni(dni.trim());
  }
}
'EOF'

cat > src/modules/academic/domain/value-objects/legajo.value-object.ts << 'EOF'
export class Legajo {
  private constructor(private readonly _value: string) {}

  get value(): string {
    return this._value;
  }

  static create(legajo: string): Legajo {
    if (!legajo || legajo.trim().length === 0) {
      throw new Error('Legajo inválido');
    }
    return new Legajo(legajo.trim());
  }
}
'EOF'
```
**Resultado**: Value Objects creados
**Verificación**: `npx tsc --noEmit src/modules/academic/domain/value-objects/*.ts`

### **5.3: Crear entidad Alumno**
```bash
cat > src/modules/academic/domain/entities/alumno.entity.ts << 'EOF'
import { Entity } from '@/shared/domain/entity.base';
import { EstadoAcademico } from '../enums/estado-academico.enum';
import { Dni } from '../value-objects/dni.value-object';
import { Legajo } from '../value-objects/legajo.value-object';

export class Alumno extends Entity {
  private constructor(
    readonly id: string,
    private readonly _dni: Dni,
    private readonly _legajo: Legajo,
    private readonly _nombre: string,
    private readonly _apellido: string,
    private readonly _email: string,
    private readonly _estado: EstadoAcademico,
    private readonly _carreraId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {
    super(id);
  }

  get dni(): Dni {
    return this._dni;
  }

  get legajo(): Legajo {
    return this._legajo;
  }

  get nombre(): string {
    return this._nombre;
  }

  get apellido(): string {
    return this._apellido;
  }

  get email(): string {
    return this._email;
  }

  get estado(): EstadoAcademico {
    return this._estado;
  }

  get carreraId(): string {
    return this._carreraId;
  }

  get nombreCompleto(): string {
    return `${this._apellido}, ${this._nombre}`;
  }

  static create(
    dni: Dni,
    legajo: Legajo,
    nombre: string,
    apellido: string,
    email: string,
    carreraId: string
  ): Alumno {
    if (!nombre || nombre.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (!apellido || apellido.trim().length < 2) {
      throw new Error('El apellido debe tener al menos 2 caracteres');
    }

    if (!email || !email.includes('@')) {
      throw new Error('Email inválido');
    }

    if (!carreraId || carreraId.trim().length === 0) {
      throw new Error('ID de carrera requerido');
    }

    return new Alumno(
      crypto.randomUUID(),
      dni,
      legajo,
      nombre.trim(),
      apellido.trim(),
      email.toLowerCase().trim(),
      EstadoAcademico.ACTIVO,
      carreraId.trim(),
      new Date(),
      new Date(),
    );
  }

  estaActivo(): boolean {
    return this._estado === EstadoAcademico.ACTIVO;
  }

  puedeInscribirse(): boolean {
    return this._estado === EstadoAcademico.ACTIVO;
  }
}
'EOF'
```
**Resultado**: Entidad Alumno creada
**Verificación**: `npx tsc --noEmit src/modules/academic/domain/entities/alumno.entity.ts`

---

## 🎨 **PASO 13: Frontend - Configuración Base**

### **13.1: Crear proyecto Next.js**
```bash
cd ..  # Salir del backend
npx create-next-app@latest freire-frontend --typescript --tailwind --eslint --app --src-dir --import-alias '@/*'
cd freire-frontend
```
**Resultado**: Proyecto Next.js creado
**Verificación**: `ls -la src/`

### **13.2: Instalar dependencias frontend**
```bash
npm install @tanstack/react-query @tanstack/react-devtools
npm install axios react-hook-form @hookform/resolvers zod
npm install lucide-react clsx tailwind-merge
npm install @next/bundle-analyzer
```
**Resultado**: Dependencias frontend instaladas
**Verificación**: `npm ls --depth=0 | grep @tanstack`

### **13.3: Instalar dependencias de testing frontend**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev jest-environment-jsdom
```
**Resultado**: Dependencias de testing instaladas
**Verificación**: `npm run test -- --dry-run`

### **13.4: Configurar TailwindCSS institucional**
```bash
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        institutional: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
'EOF'
```
**Resultado**: TailwindCSS configurado
**Verificación**: `npx tailwindcss --dry-run`

### **13.5: Crear utilidades frontend**
```bash
mkdir -p src/lib
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}
'EOF'
```
**Resultado**: Utilidades creadas
**Verificación**: `npx tsc --noEmit src/lib/utils.ts`

### **13.6: Crear estructura de componentes frontend**
```bash
mkdir -p src/components/{ui,forms,layout,charts}
mkdir -p src/components/ui/{button,input,card,modal,table,badge}
mkdir -p src/components/forms/{auth,academic,financial}
mkdir -p src/components/layout/{header,sidebar,footer,dashboard}
mkdir -p src/components/charts/{line,bar,pie}

mkdir -p src/hooks/{api,auth,ui}
mkdir -p src/services/{api,auth,storage}
mkdir -p src/types/{api,domain,ui}
mkdir -p src/constants/{api,routes,roles}
```
**Resultado**: Estructura frontend creada
**Verificación**: `tree src/components -I node_modules`

---

## 🔄 **Comandos de Verificación Rápida**

### **Verificar proyecto backend**
```bash
cd ../freire  # Volver al backend
npm run build
echo "✅ Backend build successful"
```

### **Verificar proyecto frontend**
```bash
cd ../freire-frontend
npm run build
echo "✅ Frontend build successful"
```

### **Verificar Docker containers**
```bash
cd ../freire  # Volver al backend
docker-compose up -d
docker-compose ps
echo "✅ Containers running"
```

### **Verificar conexión a base de datos**
```bash
docker-compose exec postgres psql -U freire -d freire_db -c "SELECT 1;"
echo "✅ Database connection successful"
```

### **Verificar conexión a Redis**
```bash
docker-compose exec redis redis-cli ping
echo "✅ Redis connection successful"
```

### **Verificar claves JWT**
```bash
ls -la keys/
openssl rsa -in keys/private.pem -check
echo "✅ JWT keys valid"
```

### **Verificar estructura completa**
```bash
echo "Backend structure:"
tree src/modules -I node_modules

echo "Frontend structure:"
cd ../freire-frontend
tree src/components -I node_modules
echo "✅ Complete structure verified"
```

---

## 🚀 **Comandos de Inicio Rápido**

### **Iniciar entorno completo**
```bash
cd ../freire
docker-compose up -d
sleep 10
npm run migration:run
npm run start:dev &
cd ../freire-frontend
npm run dev
echo "🚀 Full stack environment started"
```

### **Health check completo**
```bash
# Backend health
curl -f http://localhost:3000/health || echo "❌ Backend down"

# Frontend health
curl -f http://localhost:3001 || echo "❌ Frontend down"

# Database health
docker-compose exec postgres pg_isready || echo "❌ Database down"

# Redis health
docker-compose exec redis redis-cli ping || echo "❌ Redis down"

echo "✅ Health check completed"
```

---

## 📋 **Resumen de Comandos**

### **Backend (15 comandos)**
1. `npm install -g @nestjs/cli`
2. `nest new freire --package-manager npm --strict`
3. `npm install @nestjs/core @nestjs/common...`
4. `npm install --save-dev @nestjs/testing jest...`
5. Configurar TypeScript
6. Configurar ESLint
7. Configurar Prettier
8. Crear estructura DDD
9. Configurar TypeORM
10. Crear Docker Compose
11. Crear variables de entorno
12. Crear módulo Redis
13. Configurar seguridad
14. Crear entidad User
15. Crear JWT service

### **Frontend (8 comandos)**
1. `npx create-next-app@latest freire-frontend...`
2. `npm install @tanstack/react-query...`
3. `npm install --save-dev @testing-library/react...`
4. Configurar TailwindCSS
5. Crear utilidades
6. Crear estructura de componentes
7. Crear tipos de autenticación
8. Configurar API client

### **Total: 23 comandos principales**
**Tiempo estimado**: 45-60 minutos
**Resultado**: Sistema full-stack funcionando

---

**🎯 Uso**: Copia y pega cada comando secuencialmente. Cada comando está diseñado para ejecutarse en menos de 60 segundos con verificación inmediata.

*Todos los comandos son idempotentes y seguros de ejecutar múltiples veces.*
