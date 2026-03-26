# 🏗️ **ARQUITECTURA_SERVER_FIRST.md**
# Guía Completa de Arquitectura Server-First - Instituto Paulo Freire

**Stack**: SvelteKit 2 + Svelte 5 + Prisma + PostgreSQL + Docker  
**Arquitectura**: Server-First Rendering con Seguridad Enterprise-Grade

---

## 📋 **Propósito del Documento**

Esta guía funciona como la **única fuente de verdad** para el desarrollo del sistema del Instituto Paulo Freire. No es solo documentación, sino la **filosofía arquitectónica** que define cómo se construye, despliega y mantiene un sistema educativo moderno y seguro.

**Principios Fundamentales**:
- ✅ **Server-First Rendering**: Todo el procesamiento en el servidor
- ✅ **Seguridad por Diseño**: Datos sensibles protegidos por arquitectura
- ✅ **Type Safety**: Tipado extremo con Prisma y TypeScript
- ✅ **Performance First**: Optimización para velocidad y experiencia de usuario
- ✅ **Infrastructure as Code**: Docker y configuración como código

---

## 🎯 **1. Arquitectura y Visión General**

### **🏛️ Paradigma Server-First**

El sistema sigue el paradigma **Server-First Rendering** donde SvelteKit se encarga de todo el procesamiento en el servidor, generando HTML estático que se envía al cliente.

**Ventajas para el Instituto Paulo Freire**:
- **Seguridad Máxima**: Lógica de negocio y datos nunca expuestos al cliente
- **Performance Superior**: Tiempo de carga casi instantáneo
- **SEO Optimizado**: HTML pre-renderizado para motores de búsqueda
- **Accesibilidad Universal**: Funciona sin JavaScript en el cliente
- **Experiencia Offline**: Service Workers habilitan funcionalidad sin conexión

### **📊 Diagrama de Arquitectura**

```mermaid
graph TB
    subgraph "Cliente"
        A[Navegador] --> B[HTML Estático]
        B --> C[Service Worker]
        C --> D[Cache Local]
    end
    
    subgraph "Servidor SvelteKit"
        E[Load Function] --> F[Hooks.server.ts]
        F --> G[Form Actions]
        F --> H[API Routes +server]
        H --> I[Prisma Client]
        I --> J[PostgreSQL]
        H --> K[Variables Privadas]
    end
    
    subgraph "Infraestructura"
        L[Docker Compose] --> M[PostgreSQL Container]
        L --> N[SvelteKit App Container]
        L --> O[Hardened Images]
    end
```

---

## 🛠️ **2. Stack Tecnológico y Configuración**

### **📋 Frontend & Framework**
- **Framework**: SvelteKit 2 con Svelte 5
- **Rendering**: Server-First (SSR) + Static Site Generation
- **Estilos**: TailwindCSS 4 con PostCSS
- **Componentes**: Svelte 5 con `<script>` y `<script context="module">`
- **State Management**: Svelte stores con persistencia opcional
- **Type Safety**: TypeScript strict con configuración enterprise

### **🔧 Backend & API**
- **API Routes**: `/src/routes/api/**/*` con handlers TypeScript
- **ORM**: Prisma Client con type safety extremo
- **Base de Datos**: PostgreSQL 15+ con connection pooling
- **Autenticación**: JWT con refresh tokens y cookies httpOnly
- **Validación**: Zod schemas para validación de datos
- **Testing**: Vitest + Testing Library

### **🐳 Infraestructura y DevOps**
- **Containerización**: Docker con multi-stage builds
- **Orquestación**: Docker Compose con redes aisladas
- **Base de Datos**: PostgreSQL en contenedor aislado
- **Despliegue**: Kubernetes o Docker Swarm con rolling updates
- **Monitoring**: Logs estructurados y métricas de aplicación

---

## 📁 **3. Estructura de Proyecto Server-First**

```
freire/
├── src/
│   ├── lib/
│   │   ├── components/           # 🎨 Componentes UI Svelte
│   │   │   ├── ui/              # Componentes base reutilizables
│   │   │   ├── forms/           # Formularios especializados
│   │   │   └── layout/          # Layouts y plantillas
│   │   ├── server/               # 🔐 Módulos servidor-only
│   │   │   ├── auth/            # Autenticación y autorización
│   │   │   ├── academic/         # Lógica académica
│   │   │   ├── financial/        # Lógica financiera
│   │   │   └── shared/           # Utilidades compartidas servidor
│   │   └── utils/               # 🛠️ Utilidades cliente y servidor
│   │       ├── auth/              # Validaciones y helpers auth
│   │       ├── validation/        # Validaciones con Zod
│   │       └── helpers/           # Funciones puras
│   ├── routes/                  # 🚦 Rutas SvelteKit
│   │   ├── (routes)            # Páginas SSR
│   │   │   ├── +page.svelte     # Componente de página
│   │   │   ├── +page.server.ts  # Server load function
│   │   │   └── +layout.svelte   # Layout de página
│   │   └── api/               # 📡 API Routes
│   │       ├── +server.ts        # API handlers
│   │       └── +types.ts        # TypeScript types
│   ├── app.html                 # 📄 Template HTML principal
│   ├── app.css                  # 🎨 Estilos globales
│   └── hooks.server.ts         # 🪝 Hooks globales del servidor
├── prisma/                      # 🗄️ Base de datos Prisma
│   ├── schema.prisma            # Modelo de datos
│   ├── migrations/               # Migraciones SQL
│   └── seed.ts                 # Datos iniciales
├── test/                         # 🧪 Testing
│   ├── unit/                   # Tests unitarios
│   ├── integration/             # Tests de integración
│   └── e2e/                    # Tests end-to-end
├── docker/                       # 🐳 Configuración Docker
│   ├── Dockerfile               # Imagen de aplicación
│   ├── docker-compose.yml        # Orquestación local
│   └── docker-compose.prod.yml  # Orquestación producción
├── docs/                         # 📚 Documentación
│   ├── api/                    # Documentación de API
│   ├── deployment/              # Guías de despliegue
│   └── architecture/            # Decisiones arquitectónicas
└── scripts/                      # ⚙️ Scripts de automatización
```

---

## 🔐 **4. Seguridad por Diseño Arquitectónico**

### **🛡️ Principios de Seguridad Server-First**

#### **4.1 Aislamiento de Datos Sensibles**
```typescript
// ✅ Variables Privadas - Nunca en el cliente
import { env } from '$env/dynamic/private';

export const databaseUrl = env('DATABASE_URL');
export const jwtSecret = env('JWT_SECRET');
export const emailServiceKey = env('EMAIL_SERVICE_KEY');

// ❌ NUNCA hacer esto
export const apiKey = 'secret-key'; // Esto se filtraría al cliente
```

#### **4.2 Validación de Entrada**
```typescript
// ✅ Validación con Zod en el servidor
import { z } from 'z';
import type { Actions } from './$types';

export const actions: Actions = {
  register: async ({ request }) => {
    const formData = await request.formData();
    const schema = z.object({
      email: z.string().email('Email inválido'),
      password: z.string().min(8, 'Mínimo 8 caracteres'),
      firstName: z.string().min(2, 'Nombre requerido'),
      lastName: z.string().min(2, 'Apellido requerido')
    });

    const data = schema.parse(Object.fromEntries(formData));
    // Procesamiento seguro...
  }
};
```

#### **4.3 Autenticación Centralizada**
```typescript
// ✅ Hooks globales para validación
import type { Handle } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  // Validar token en cada request
  const sessionToken = event.cookies.get('session-token');
  if (sessionToken) {
    const user = await AuthService.validateSessionToken(sessionToken);
    if (user) {
      event.locals.user = user; // Disponible globalmente
    } else {
      event.cookies.delete('session-token', { path: '/' });
    }
  }

  // Headers de seguridad
  const response = await resolve(event);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
};
```

---

## 🚀 **5. Ciclo de Vida de los Datos (Prisma)**

### **📊 Modelo de Datos Centralizado**
```prisma
// ✅ Schema unificado con relaciones claras
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  firstName String
  lastName  String
  role      Role     @default(ALUMNO)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relaciones
  refreshTokens RefreshToken[]
  academicRecords AcademicRecord[]
  enrollments   Enrollment[]
  
  @@index([email])
  @@map("users_by_email")
}

model Role {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  permissions Json?   // Permisos específicos del rol
  
  @@map("roles_by_name")
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: {id: userId}, onDelete: Cascade)
  
  @@index([userId])
  @@index([token])
  @@index([expiresAt])
}
```

### **🔄 Migraciones y Versionado**
```bash
# ✅ Migraciones versionadas con Prisma
npx prisma migrate dev          # Desarrollo
npx prisma migrate deploy        # Producción
npx prisma db seed           # Datos iniciales

# ✅ Generación automática de cliente
npx prisma generate              # Después de cada cambio
```

---

## 🎨 **6. Desarrollo Frontend Svelte 5**

### **📝 Componentes Modernos**
```svelte
<!-- ✅ Svelte 5 con TypeScript strict -->
<script lang="ts">
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  
  // ✅ Types explícitos para validación
  interface FormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
  
  let formData: FormData = new FormData();
  let errors: Record<string, string> = {};
  let isLoading = false;

  // ✅ Validación reactiva
  $: isValid = {
    email: formData.get('email')?.toString().includes('@'),
    password: formData.get('password')?.toString().length >= 8,
    firstName: formData.get('firstName')?.toString().length >= 2,
    lastName: formData.get('lastName')?.toString().length >= 2
  };

  const handleSubmit = async () => {
    if (!$isValid.email || !$isValid.password) {
      errors.email = !$isValid.email ? 'Email inválido' : '';
      errors.password = !$isValid.password ? 'Contraseña muy corta' : '';
      return;
    }
    
    isLoading = true;
    // Envío seguro al servidor
  };
</script>
```

### **🎭 TailwindCSS 4 Optimizado**
```css
/* ✅ Configuración de producción */
@layer base {
  @import "tailwindcss/base";
  @import "components";
}

@layer components {
  @import "tailwindcss/components";
  
  /* ✅ Componentes institucionales */
  .btn-primary {
    @apply bg-indigo-600 text-white px-4 py-2 rounded-md;
  }
  
  .card-institucional {
    @apply bg-white shadow-lg border-l-4 border-indigo-200;
  }
}

@layer utilities {
  @import "tailwindcss/utilities";
  
  /* ✅ Utilidades personalizadas */
  .text-shadow-institucional {
    text-shadow: 0 2px 4px rgba(0, 0, 0.1, 0.1);
  }
}
```

---

## 🔧 **7. Backend Server-First**

### **📡 API Routes con TypeScript**
```typescript
// ✅ API routes con type safety completo
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { prisma } from '$lib/server/prisma';

// ✅ Validación de entrada con Zod
const createInscriptionSchema = z.object({
  studentId: z.string().cuid('ID de alumno inválido'),
  courseId: z.string().cuid('ID de curso inválido'),
  semester: z.string().min(1, 'Semestre requerido')
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = createInscriptionSchema.parse(body);
    
    // ✅ Lógica de negocio con Prisma
    const inscription = await prisma.inscription.create({
      data: {
        studentId: validated.studentId,
        courseId: validated.courseId,
        semester: validated.semester,
        status: 'PENDING',
        createdAt: new Date()
      }
    });
    
    return json({
      success: true,
      data: {
        id: inscription.id,
        status: inscription.status
      }
    });
  } catch (error) {
    return json({
      success: false,
      error: 'Error al crear inscripción'
    }, { status: 400 });
  }
};
```

### **🔐 Middleware de Seguridad**
```typescript
// ✅ Middleware para validación global
import type { Handle } from '@sveltejs/kit';
import { RateLimit } from '$lib/server/middleware/rate-limit';

export const handle: Handle = RateLimit({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 100,
  message: 'Demasiadas solicitudes'
})(async ({ event, resolve }) => {
  // Headers de seguridad
  const response = await resolve(event);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  
  return response;
});
```

---

## 🐳 **8. Infraestructura Docker y Producción**

### **🏗️ Docker Multi-Stage**
```dockerfile
# ✅ Dockerfile optimizado para Server-First
FROM node:18-alpine AS base

# ✅ Dependencias
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ✅ Prisma client generation
COPY prisma ./prisma/
RUN npx prisma generate

# ✅ Build optimizado
COPY . .
RUN npm run build

# ✅ Usuario no-root para seguridad
RUN addgroup -g sveltekit && adduser -g sveltekit -u sveltekit
USER sveltekit

# ✅ Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5173/api/health || exit 1

EXPOSE 5173
CMD ["node", "build"]
```

### **🔧 Docker Compose para Producción**
```yaml
# ✅ docker-compose.prod.yml
version: '3.8'

services:
  # ✅ Base de datos aislada
  postgres:
    image: postgres:15-alpine
    container_name: freire-postgres-prod
    environment:
      POSTGRES_DB: ${DB_DATABASE}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data_prod:/var/lib/postgresql/data
    networks:
      - freire-internal
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ✅ Aplicación SvelteKit
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: freire-app:latest
    container_name: freire-app-prod
    environment:
      - NODE_ENV=production
      - PORT=5173
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_DATABASE}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    ports:
      - "443:5173"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - freire-internal  # Base de datos
      - freire-external  # Internet
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5173/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  # ✅ Red interna aislada
  freire-internal:
    driver: bridge
    internal: true
    
  # ✅ Red externa
  freire-external:
    driver: bridge

volumes:
  postgres_data_prod:
    driver: local
```

---

## 📊 **9. Monitoring y Observabilidad**

### **📈 Logs Estructurados**
```typescript
// ✅ Sistema de logs con niveles
import { logger } from '$lib/server/utils/logger';

export class AuditService {
  static logUserAction(userId: string, action: string, metadata?: any) {
    logger.info('USER_ACTION', {
      userId,
      action,
      metadata,
      timestamp: new Date().toISOString(),
      userAgent: event.request.headers.get('user-agent'),
      ip: event.getClientAddress()
    });
  }

  static logSecurityEvent(event: string, severity: 'LOW' | 'MEDIUM' | 'HIGH', details: any) {
    logger.warn('SECURITY_EVENT', {
      event,
      severity,
      details,
      timestamp: new Date().toISOString()
    });
  }
}
```

### **📊 Métricas de Aplicación**
```typescript
// ✅ Métricas en tiempo real
import { performance } from 'perf_hooks';

export class MetricsService {
  private static metrics = {
    requests: 0,
    errors: 0,
    responseTime: []
  };

  static recordRequest(duration: number) {
    this.metrics.requests++;
    this.metrics.responseTime.push(duration);
    
    // Alerta si el tiempo de respuesta es alto
    if (duration > 1000) {
      logger.warn('SLOW_REQUEST', {
        duration,
        threshold: 1000
      });
    }
  }

  static getAverageResponseTime(): number {
    const sum = this.metrics.responseTime.reduce((a, b) => a + b, 0);
    return sum / this.metrics.responseTime.length;
  }
}
```

---

## 🔄 **10. Testing y Calidad**

### **🧪 Testing Pyramid con Vitest**
```typescript
// ✅ Tests unitarios con mocking
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { PrismaClient } from '@prisma/client';

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  }
} satisfies Partial<PrismaClient>;

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe autenticar usuario válido', async () => {
    const mockUser = { id: '1', email: 'test@example.com', role: 'ALUMNO' };
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    
    const result = await AuthService.login('test@example.com', 'password123');
    
    expect(result.success).toBe(true);
    expect(result.user).toEqual(mockUser);
  });
});
```

### **🔧 Testing E2E con Playwright**
```typescript
// ✅ Tests end-to-end con browser automation
import { test, expect } from '@playwright/test';

test('flujo completo de inscripción', async ({ page }) => {
  await page.goto('/register');
  
  // Registrar usuario
  await page.fill('[name="email"]', 'student@instituto.edu');
  await page.fill('[name="password"]', 'SecurePassword123!');
  await page.fill('[name="firstName"]', 'Juan');
  await page.fill('[name="lastName"]', 'Pérez');
  await page.click('[type="submit"]');
  
  // Verificar redirección a login
  await expect(page).toHaveURL(/\/login/);
  
  // Iniciar sesión
  await page.fill('[name="email"]', 'student@instituto.edu');
  await page.fill('[name="password"]', 'SecurePassword123!');
  await page.click('[type="submit"]');
  
  // Verificar acceso al dashboard
  await expect(page).toHaveURL(/\/dashboard/);
});
```

---

## 📚 **11. Documentación Viva**

### **📖 Documentación de API Automática**
```typescript
// ✅ OpenAPI/Swagger con SvelteKit
import { OpenAPIHono } from '@hono/zod-openapi';
import type { OpenAPIHono } from '@hono/zod-openapi';

// Generar documentación desde los handlers
export const generateAPIDocumentation = () => {
  const spec = new OpenAPIHono({
    openapi: '3.0.0',
    info: {
      title: 'API Instituto Paulo Freire',
      version: '1.0.0',
      description: 'API RESTful para gestión académica'
    },
    servers: [
      {
        url: 'https://api.paulofreire.edu',
        description: 'Servidor de producción'
      }
    ]
  });

  return spec;
};
```

---

## 🎯 **12. Guía de Implementación**

### **📋 Checklist de Arquitectura Server-First**

#### **Fase 1: Configuración Inicial**
- [ ] **Proyecto SvelteKit creado** con TypeScript strict
- [ ] **Prisma configurado** con schema completo
- [ ] **Variables privadas** configuradas con `$env/dynamic/private`
- [ ] **Docker compose** con redes aisladas
- [ ] **CI/CD pipeline** configurada para builds automáticos

#### **Fase 2: Desarrollo Core**
- [ ] **Autenticación completa** con JWT y cookies seguras
- [ ] **API routes** con validación Zod y type safety
- [ ] **Form actions** implementadas para todas las mutaciones
- [ ] **Hooks globales** para validación de sesión
- [ ] **Componentes UI** con Svelte 5 y TailwindCSS 4

#### **Fase 3: Testing y Calidad**
- [ ] **Tests unitarios** con >80% de cobertura
- [ ] **Tests E2E** con Playwright para flujos críticos
- [ ] **Performance testing** para validar tiempos de carga
- [ ] **Security testing** para validar protección de datos

#### **Fase 4: Producción**
- [ ] **Docker hardened** configurado para producción
- [ ] **Base de datos** con backups automáticos
- [ ] **Monitoring** implementado con logs y métricas
- [ ] **SSL/TLS** configurado para HTTPS
- [ ] **Rolling updates** configurados sin downtime

---

## 🚀 **13. Conclusiones y Mejores Prácticas**

### **🏆 Beneficios de la Arquitectura Server-First**

1. **Seguridad Máxima**: Datos sensibles protegidos por diseño
2. **Performance Superior**: Tiempos de carga sub-100ms
3. **SEO Optimizado**: HTML pre-renderizado para motores de búsqueda
4. **Accesibilidad Universal**: Funciona sin JavaScript
5. **Experiencia Offline**: Service Workers habilitan funcionalidad
6. **Costos Optimizados**: Menos transferencia de datos
7. **Escalabilidad Horizontal**: Fácil despliegue en múltiples instancias

### **📈 Métricas de Éxito**

- **Time to First Byte**: < 100ms
- **Lighthouse Performance**: > 90 puntos
- **Bundle Size**: < 100KB gzipped
- **Type Safety Coverage**: > 95%
- **Test Coverage**: > 85%
- **Uptime**: > 99.9%

---

## 📖 **14. Referencias y Estándares**

### **🔗 Estándares Seguidos**
- **OWASP Top 10**: Protección contra vulnerabilidades web
- **GDPR Compliance**: Manejo de datos personales europeo
- **WCAG 2.1 AA**: Accesibilidad para usuarios con discapacidades
- **ISO 27001**: Seguridad de la información
- **NIST Cybersecurity Framework**: Prácticas de seguridad industrial

### **📚 Recursos de Aprendizaje**
- **SvelteKit Documentation**: https://kit.svelte.dev/docs
- **Prisma Best Practices**: https://www.prisma.io/docs/concepts/components/best-practices
- **TailwindCSS 4**: https://tailwindcss.com/docs
- **Docker Security**: https://docs.docker.com/engine/security/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

**Esta guía es la única fuente de verdad para el desarrollo del Instituto Paulo Freire. Cual desviación de estos principios debe ser documentada y aprobada por el equipo de arquitectura.**
