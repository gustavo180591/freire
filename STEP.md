# 🚀 **STEP.md**
# Guía de Desarrollo Modular y Seguro - Sistema Paulo Freire
Instituto Superior de Formación Docente – Paulo Freire

**Stack Tecnológico Principal**:
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL + TypeORM
- **Cache**: Redis
- **Auth**: JWT RS256 + Refresh Tokens
- **Architecture**: Clean Architecture + DDD
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest + Testing Library
- **Development**: 100% Remoto con Docker
- **Frontend**: Next.js 14 + TypeScript + TailwindCSS

---

## 📋 **Propósito del Documento**

Guía paso a paso para construir el sistema educativo enterprise con seguridad desde el inicio. Cada paso está diseñado para ser completado en 30-60 minutos con código modular y verificable.

**Principios Clave**:
- ✅ Máximo 500 líneas por archivo
- ✅ Tests obligatorios por componente
- ✅ Security-first mindset
- ✅ Modularidad extrema
- ✅ 100% remoto desde el inicio

---

## 🔧 **PASO 1: Configuración Base del Proyecto**

### **1.1: Crear Proyecto NestJS con Configuración Estricta**

**Objetivo**: Inicializar proyecto con configuración enterprise-ready
**Tiempo estimado**: 30 minutos
**Archivos**: package.json, tsconfig.json, nest-cli.json
**Líneas máximas**: 200 líneas totales
**Tests requeridos**: 1 test básico de configuración

**Implementación**:
```bash
# Crear proyecto con configuración estricta
npm install -g @nestjs/cli
nest new freire --package-manager npm --strict
cd freire

# Configuración TypeScript estricta
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "paths": {
      "@/*": ["src/*"],
      "@/modules/*": ["src/modules/*"],
      "@/shared/*": ["src/shared/*"]
    }
  }
}
EOF
```

**Verificación**:
```bash
npm run build
echo "✅ TypeScript compilation successful"
```

**Consideraciones de Seguridad**:
- TypeScript strict mode previene errores en runtime
- Path aliases evitan expuestos relativos
- Build verification garantiza código compilable

---

### **1.2: Instalar Dependencias Esenciales (Máximo 20 Paquetes)**

**Objetivo**: Instalar solo dependencias necesarias y seguras
**Tiempo estimado**: 20 minutos
**Archivos**: package.json
**Líneas máximas**: 100 líneas
**Tests requeridos**: 1 test de dependencias

**Implementación**:
```bash
# Dependencias principales - solo las esenciales
npm install @nestjs/core @nestjs/common @nestjs/platform-express
npm install @nestjs/typeorm typeorm pg ioredis
npm install @nestjs/jwt @nestjs/passport @nestjs/config
npm install @nestjs/throttler helmet compression
npm install passport passport-jwt bcrypt class-validator class-transformer
npm install @nestjs/event-emitter uuid reflect-metadata

# Dependencias de desarrollo
npm install --save-dev @nestjs/testing jest @types/jest
npm install --save-dev rimraf prettier eslint @types/bcrypt @types/uuid
npm install --save-dev @types/passport-jwt @types/supertest supertest
```

**Verificación**:
```bash
npm ls --depth=0
echo "✅ Dependencies installed successfully"
```

**Consideraciones de Seguridad**:
- Versiones fijadas para evitar vulnerabilities
- Solo paquetes necesarios instalados
- Development dependencies separadas

---

### **1.3: Configurar ESLint y Prettier**

**Objetivo**: Configuración de código consistente y segura
**Tiempo estimado**: 20 minutos
**Archivos**: .eslintrc.js, .prettierrc, .gitignore
**Líneas máximas**: 80 líneas por archivo
**Tests requeridos**: 1 test de linting

**Implementación**:
```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    '@nestjs/eslint-config-nestjs',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
```

```json
// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

**Verificación**:
```bash
npx eslint src --ext .ts
npx prettier --check src/**/*.ts
echo "✅ Code formatting configured"
```

**Consideraciones de Seguridad**:
- Linting previene código inseguro
- Formatting consistente reduce bugs
- Configuración estricta desde el inicio

---

### **1.4: Crear Estructura de Carpetas DDD**

**Objetivo**: Estructura modular siguiendo Domain-Driven Design
**Tiempo estimado**: 15 minutos
**Archivos**: Carpetas y archivos base
**Líneas máximas**: 0 (solo estructura)
**Tests requeridos**: N/A

**Implementación**:
```bash
# Estructura DDD completa
mkdir -p src/modules/academic/{domain,application,infrastructure,presentation}
mkdir -p src/modules/academic/domain/{aggregates,services,events,value-objects}
mkdir -p src/modules/academic/application/{use-cases,services,queries,dto}
mkdir -p src/modules/academic/infrastructure/{repositories,entities,mappers,events}
mkdir -p src/modules/academic/presentation/{controllers,dto,guards,interceptors,filters}

mkdir -p src/modules/auth/{domain,application,infrastructure,presentation}
mkdir -p src/modules/auth/domain/{aggregates,services,events}
mkdir -p src/modules/auth/application/{use-cases,services,dto}
mkdir -p src/modules/auth/infrastructure/{repositories,entities,security}
mkdir -p src/modules/auth/presentation/{controllers,dto,guards}

mkdir -p src/modules/financial/{domain,application,infrastructure,presentation}
mkdir -p src/shared/{domain,infrastructure,presentation}
mkdir -p src/shared/domain/{base,interfaces,value-objects}
mkdir -p src/shared/infrastructure/{services,config,security}
mkdir -p src/shared/presentation/{guards,interceptors,filters,decorators}

mkdir -p test/{unit,integration,e2e}
mkdir -p docs docker scripts
```

**Verificación**:
```bash
tree src -I node_modules
echo "✅ DDD structure created"
```

**Consideraciones de Seguridad**:
- Separación clara de responsabilidades
- Módulos aislados por bounded context
- Infrastructure separada del dominio

---

## 🗄️ **PASO 2: Infraestructura de Datos**

### **2.1: Configurar TypeORM con DataSource Moderno**

**Objetivo**: Configuración de base de datos segura y moderna
**Tiempo estimado**: 30 minutos
**Archivos**: src/config/database.config.ts
**Líneas máximas**: 80 líneas
**Tests requeridos**: 2 tests de conexión

**Implementación**:
```typescript
// src/config/database.config.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    process.env.NODE_ENV === 'development'
      ? 'src/**/*.entity.ts'
      : 'dist/**/*.entity.js'
  ],
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // Security: Never use in production
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  extra: {
    max: 20, // Connection pool limit
    min: 5,
    acquire: 30000,
    idle: 10000,
  },
});

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await AppDataSource.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
```

**Verificación**:
```bash
# Crear test básico
npm test -- --testNamePattern="Database Connection"
echo "✅ TypeORM configured"
```

**Consideraciones de Seguridad**:
- Synchronize desactivado en producción
- Connection pooling configurado
- SSL en producción
- Health checks implementados

---

### **2.2: Crear Docker Compose para Desarrollo (100% Remoto)**

**Objetivo**: Entorno de desarrollo local contenerizado
**Tiempo estimado**: 25 minutos
**Archivos**: docker-compose.yml, docker-compose.override.yml
**Líneas máximas**: 120 líneas totales
**Tests requeridos**: 1 test de contenedores

**Implementación**:
```yaml
# docker-compose.yml
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
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    networks:
      - freire-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME:-freire}"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    container_name: freire-redis
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-redis123}
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    networks:
      - freire-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  freire-network:
    driver: bridge
```

```yaml
# docker-compose.override.yml (para desarrollo local)
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: freire-app
    ports:
      - "${PORT:-3000}:3000"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - REDIS_HOST=redis
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - freire-network
    command: npm run start:dev
```

**Verificación**:
```bash
docker-compose up -d
docker-compose ps
echo "✅ Docker containers running"
```

**Consideraciones de Seguridad**:
- Contraseñas por variables de entorno
- Health checks configurados
- Red interna aislada
- Volúmenes persistentes

---

### **2.3: Configurar Variables de Entorno Seguras**

**Objetivo**: Configuración segura por ambiente
**Tiempo estimado**: 20 minutos
**Archivos**: .env.example, .env, .env.test
**Líneas máximas**: 60 líneas por archivo
**Tests requeridos**: 1 test de configuración

**Implementación**:
```bash
# .env.example (plantilla segura)
cat > .env.example << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=freire
DB_PASSWORD=your_secure_password_here
DB_DATABASE=freire_db

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password_here

# JWT Configuration (RS256)
JWT_PRIVATE_KEY_PATH=./keys/private.pem
JWT_PUBLIC_KEY_PATH=./keys/public.pem
JWT_EXPIRATION=3600
JWT_REFRESH_EXPIRATION=604800

# Application Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
API_RATE_LIMIT=100

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_here
CORS_ORIGIN=http://localhost:3000

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=json
EOF

# .env (desarrollo local)
cp .env.example .env
```

**Verificación**:
```bash
npm run start:dev
echo "✅ Environment variables loaded"
```

**Consideraciones de Seguridad**:
- Plantilla sin valores reales
- .env en .gitignore
- Claves RSA para JWT
- Rate limiting configurado

---

### **2.4: Implementar Conexión Redis Segura**

**Objetivo**: Cache y sesiones con Redis seguro
**Tiempo estimado**: 25 minutos
**Archivos**: src/modules/redis/redis.module.ts, src/shared/infrastructure/redis.client.ts
**Líneas máximas**: 100 líneas totales
**Tests requeridos**: 2 tests de Redis

**Implementación**:
```typescript
// src/modules/redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redis = new Redis({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });

        redis.on('error', (err) => {
          console.error('Redis connection error:', err);
        });

        redis.on('connect', () => {
          console.log('Redis connected successfully');
        });

        return redis;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
```

```typescript
// src/shared/infrastructure/redis.client.ts
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisClient {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.setex(key, ttl, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

**Verificación**:
```bash
npm test -- --testNamePattern="Redis"
echo "✅ Redis connection working"
```

**Consideraciones de Seguridad**:
- Lazy connect para evitar fallos
- Password protection
- Error handling robusto
- Health checks implementados

---

### **2.5: Crear Sistema de Migraciones**

**Objetivo**: Control de versiones de base de datos
**Tiempo estimado**: 20 minutos
**Archivos**: src/config/migration.config.ts, scripts/migrate.sh
**Líneas máximas**: 80 líneas totales
**Tests requeridos**: 1 test de migración

**Implementación**:
```typescript
// src/config/migration.config.ts
import { DataSource } from 'typeorm';
import { AppDataSource } from './database.config';

export const MigrationDataSource = new DataSource({
  ...AppDataSource.options,
  migrations: ['src/migrations/*.ts'],
  migrationsRun: false,
});

// Script para generar migración
export async function generateMigration(name: string): Promise<void> {
  const dataSource = await MigrationDataSource.initialize();
  await dataSource.driver.createMigration({
    name,
    timestamp: new Date().getTime(),
  });
  await dataSource.destroy();
}
```

```bash
#!/bin/bash
# scripts/migrate.sh
set -e

echo "🔄 Running database migrations..."

# Verificar conexión a base de datos
npm run typeorm -- query "SELECT 1" || {
  echo "❌ Database connection failed"
  exit 1
}

# Ejecutar migraciones
npm run migration:run

echo "✅ Migrations completed successfully"

# Verificar estado
npm run typeorm -- query "SELECT version FROM migrations ORDER BY version DESC LIMIT 1"
```

**Verificación**:
```bash
chmod +x scripts/migrate.sh
./scripts/migrate.sh
echo "✅ Migration system working"
```

**Consideraciones de Seguridad**:
- Migraciones versionadas
- Rollback capabilities
- Verificación post-migración
- Scripts idempotentes

---

## 🛡️ **PASO 3: Seguridad Base**

### **3.1: Configurar Helmet y Middleware de Seguridad**

**Objetivo**: Protección HTTP a nivel de aplicación
**Tiempo estimado**: 25 minutos
**Archivos**: src/main.ts, src/config/security.config.ts
**Líneas máximas**: 100 líneas totales
**Tests requeridos**: 3 tests de seguridad

**Implementación**:
```typescript
// src/config/security.config.ts
import * as helmet from 'helmet';

export const securityConfig = {
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    frameguard: { action: 'deny' },
    xssFilter: true,
  }),
};

export const corsConfig = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
```

```typescript
// src/main.ts (actualizado)
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { securityConfig, corsConfig } from './config/security.config';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad enterprise
  app.use(securityConfig.helmet);
  app.use(compression());
  
  // CORS seguro
  app.enableCors(corsConfig);
  
  // Validación estricta
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  await app.listen(process.env.PORT || 3000);
  
  console.log(`🚀 Application running on port ${process.env.PORT || 3000}`);
}
bootstrap();
```

**Verificación**:
```bash
npm run start:dev
curl -I http://localhost:3000 | grep -E "(X-Frame-Options|X-Content-Type-Options)"
echo "✅ Security headers active"
```

**Consideraciones de Seguridad**:
- CSP configurado
- HSTS forzado
- XSS protection activo
- Frame protection

---

### **3.2: Implementar Rate Limiting**

**Objetivo**: Protección contra ataques de fuerza bruta
**Tiempo estimado**: 20 minutos
**Archivos**: src/shared/presentation/guards/throttle.guard.ts
**Líneas máximas**: 60 líneas
**Tests requeridos**: 2 tests de rate limiting

**Implementación**:
```typescript
// src/shared/presentation/guards/throttle.guard.ts
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected errorMessage = 'Too many requests, please try again later';
  
  protected getTracker(req: Record<string, any>): string {
    // Track by IP and user ID if authenticated
    const tracker = req.ip;
    if (req.user?.id) {
      return `${req.ip}:${req.user.id}`;
    }
    return tracker;
  }
}

// Configuración en app.module.ts
ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 60000, // 1 minute
    limit: 100, // 100 requests per minute
  },
  {
    name: 'medium',
    ttl: 300000, // 5 minutes
    limit: 1000, // 1000 requests per 5 minutes
  },
  {
    name: 'long',
    ttl: 3600000, // 1 hour
    limit: 10000, // 10000 requests per hour
  },
])
```

**Verificación**:
```bash
# Test rate limiting
for i in {1..105}; do curl -s http://localhost:3000/health; done
echo "✅ Rate limiting active"
```

**Consideraciones de Seguridad**:
- Múltiples niveles de throttling
- Tracking por IP y usuario
- Mensajes genéricos de error
- Configuración por endpoint

---

## 🔐 **PASO 4: Módulo de Autenticación**

### **4.1: Crear Entidad User con Campos Mínimos**

**Objetivo**: Entidad de usuario segura y mínima
**Tiempo estimado**: 30 minutos
**Archivos**: src/modules/auth/domain/entities/user.entity.ts
**Líneas máximas**: 80 líneas
**Tests requeridos**: 3 tests unitarios

**Implementación**:
```typescript
// src/modules/auth/domain/entities/user.entity.ts
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
    // Validaciones de dominio
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

  deactivate(): User {
    return new User(
      this.id,
      this._email,
      this._passwordHash,
      this._role,
      false,
      this.createdAt,
      new Date(),
    );
  }

  updatePassword(newPasswordHash: string): User {
    if (!newPasswordHash || newPasswordHash.length < 60) {
      throw new Error('Password hash inválido');
    }

    return new User(
      this.id,
      this._email,
      newPasswordHash,
      this._role,
      this._isActive,
      this.createdAt,
      new Date(),
    );
  }
}
```

**Verificación**:
```bash
npm test -- --testNamePattern="User Entity"
echo "✅ User entity working"
```

**Consideraciones de Seguridad**:
- Email siempre normalizado
- Password hash validado
- Inmutabilidad del ID
- Métodos seguros de actualización

---

### **4.2: Implementar JWT RS256 con Refresh Tokens**

**Objetivo**: Sistema de tokens seguro y moderno
**Tiempo estimado**: 40 minutos
**Archivos**: src/modules/auth/infrastructure/security/jwt.service.ts
**Líneas máximas**: 120 líneas
**Tests requeridos**: 4 tests de JWT

**Implementación**:
```typescript
// src/modules/auth/infrastructure/security/jwt.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

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

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.publicKey, {
        algorithms: ['RS256'],
      }) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  verifyRefreshToken(token: string): { sub: string; type: string } {
    try {
      return jwt.verify(token, this.publicKey, {
        algorithms: ['RS256'],
      }) as { sub: string; type: string };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}
```

**Verificación**:
```bash
npm test -- --testNamePattern="JWT Service"
echo "✅ JWT service working"
```

**Consideraciones de Seguridad**:
- Algoritmo RS256 (asimétrico)
- Refresh tokens separados
- Expiración configurable
- Validación estricta

---

## 📚 **PASO 5: Módulo Académico - Domain**

### **5.1: Crear Entidad Alumno (Máximo 150 Líneas)**

**Objetivo**: Entidad principal del dominio académico
**Tiempo estimado**: 35 minutos
**Archivos**: src/modules/academic/domain/entities/alumno.entity.ts
**Líneas máximas**: 150 líneas
**Tests requeridos**: 5 tests unitarios

**Implementación**:
```typescript
// src/modules/academic/domain/entities/alumno.entity.ts
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
    // Validaciones de dominio
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

  cambiarEstado(nuevoEstado: EstadoAcademico): Alumno {
    // Validaciones de negocio
    if (this._estado === nuevoEstado) {
      return this; // No hay cambios
    }

    // Validar transiciones de estado permitidas
    if (!this.puedeCambiarA(nuevoEstado)) {
      throw new Error(`No se puede cambiar de ${this._estado} a ${nuevoEstado}`);
    }

    return new Alumno(
      this.id,
      this._dni,
      this._legajo,
      this._nombre,
      this._apellido,
      this._email,
      nuevoEstado,
      this._carreraId,
      this.createdAt,
      new Date(),
    );
  }

  actualizarDatosBasicos(nombre: string, apellido: string, email: string): Alumno {
    if (!nombre || nombre.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (!apellido || apellido.trim().length < 2) {
      throw new Error('El apellido debe tener al menos 2 caracteres');
    }

    if (!email || !email.includes('@')) {
      throw new Error('Email inválido');
    }

    return new Alumno(
      this.id,
      this._dni,
      this._legajo,
      nombre.trim(),
      apellido.trim(),
      email.toLowerCase().trim(),
      this._estado,
      this._carreraId,
      this.createdAt,
      new Date(),
    );
  }

  estaActivo(): boolean {
    return this._estado === EstadoAcademico.ACTIVO;
  }

  puedeInscribirse(): boolean {
    return this._estado === EstadoAcademico.ACTIVO;
  }

  private puedeCambiarA(nuevoEstado: EstadoAcademico): boolean {
    // Reglas de transición de estados
    const transicionesPermitidas = {
      [EstadoAcademico.ACTIVO]: [
        EstadoAcademico.SUSPENDIDO,
        EstadoAcademico.BAJA,
        EstadoAcademico.EGRESADO,
      ],
      [EstadoAcademico.SUSPENDIDO]: [
        EstadoAcademico.ACTIVO,
        EstadoAcademico.BAJA,
      ],
      [EstadoAcademico.BAJA]: [
        EstadoAcademico.ACTIVO, // Reinscripción posible
      ],
      [EstadoAcademico.EGRESADO]: [], // Estado final
    };

    return transicionesPermitidas[this._estado]?.includes(nuevoEstado) ?? false;
  }
}
```

**Verificación**:
```bash
npm test -- --testNamePattern="Alumno Entity"
echo "✅ Alumno entity working"
```

**Consideraciones de Seguridad**:
- Validaciones estrictas de datos
- Estados controlados
- Inmutabilidad de datos clave
- Transiciones validadas

---

## 🎯 **Troubleshooting Común**

### **Problemas Frecuentes y Soluciones**

**Problema**: "Database connection failed"
```bash
# Solución
docker-compose logs postgres
# Verificar que las variables de entorno sean correctas
# Reiniciar contenedores si es necesario
docker-compose restart postgres
```

**Problema**: "Redis connection timeout"
```bash
# Solución
docker-compose logs redis
# Verificar configuración de Redis
# Testear conexión manualmente
redis-cli -h localhost -p 6379 ping
```

**Problema**: "JWT verification failed"
```bash
# Solución
# Verificar que las claves existan
ls -la keys/
# Regenerar claves si es necesario
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
```

### **Debugging Tips por Módulo**

**Auth Module**:
- Verificar tokens con jwt.io
- Revisar headers de HTTP
- Validar configuración CORS

**Academic Module**:
- Validar entidades con tests unitarios
- Revisar reglas de dominio
- Verificar mapeos a base de datos

**Infrastructure**:
- Revisar logs de Docker
- Verificar health checks
- Validar configuración de red

---

## 📊 **Best Practices por Capa**

### **Domain Layer: Inmutabilidad y Validaciones**
- Entidades inmutables (solo métodos que retornan nuevas instancias)
- Validaciones de dominio estrictas
- Value objects para datos complejos
- Eventos de dominio para cambios importantes

### **Application Layer: Use Cases Puros**
- Un solo responsibility por use case
- Sin dependencias de infraestructura
- Result pattern para manejo de errores
- Commands/Queries claros

### **Infrastructure Layer: Repositories Eficientes**
- Interfaces puras del dominio
- Queries optimizadas
- Caching estratégico
- Manejo de transacciones

### **Presentation Layer: Controllers Delgados**
- Solo HTTP concerns
- Validación de DTOs
- Mapeo a responses
- Seguridad y auditoría

---

## 🎨 **PASO 13: Frontend - Configuración Base**

### **13.1: Crear Proyecto Next.js 14 con TypeScript**

**Objetivo**: Inicializar frontend con configuración enterprise-ready
**Tiempo estimado**: 30 minutos
**Archivos**: package.json, next.config.js, tsconfig.json
**Líneas máximas**: 150 líneas totales
**Tests requeridos**: 1 test básico de configuración

**Implementación**:
```bash
# Crear proyecto Next.js 14
npx create-next-app@latest freire-frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd freire-frontend

# Instalar dependencias adicionales
npm install @tanstack/react-query @tanstack/react-devtools
npm install axios react-hook-form @hookform/resolvers zod
npm install lucide-react clsx tailwind-merge
npm install @next/bundle-analyzer

# Dependencias de desarrollo
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev jest-environment-jsdom
```

**Verificación**:
```bash
npm run build
echo "✅ Next.js build successful"
```

**Consideraciones de Seguridad**:
- TypeScript strict mode
- Bundle analyzer para optimización
- Dependencias auditadas

---

### **13.2: Configurar TailwindCSS con Diseño Institucional**

**Objetivo**: Sistema de diseño consistente y profesional
**Tiempo estimado**: 25 minutos
**Archivos**: tailwind.config.ts, src/lib/utils.ts
**Líneas máximas**: 100 líneas totales
**Tests requeridos**: 1 test de componentes UI

**Implementación**:
```typescript
// tailwind.config.ts
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
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
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
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

```typescript
// src/lib/utils.ts
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
```

**Verificación**:
```bash
npm run dev
echo "✅ TailwindCSS configured"
```

**Consideraciones de Seguridad**:
- Colores institucionales definidos
- Animaciones sutiles y accesibles
- Utilidades reutilizables

---

### **13.3: Configurar Arquitectura de Componentes**

**Objetivo**: Estructura modular y reusable de componentes
**Tiempo estimado**: 20 minutos
**Archivos**: Estructura de carpetas y componentes base
**Líneas máximas**: 0 (solo estructura)
**Tests requeridos**: N/A

**Implementación**:
```bash
# Estructura de componentes
mkdir -p src/components/{ui,forms,layout,charts}
mkdir -p src/components/ui/{button,input,card,modal,table,badge}
mkdir -p src/components/forms/{auth,academic,financial}
mkdir -p src/components/layout/{header,sidebar,footer,dashboard}
mkdir -p src/components/charts/{line,bar,pie}

# Estructura de hooks
mkdir -p src/hooks/{api,auth,ui}

# Estructura de servicios
mkdir -p src/services/{api,auth,storage}

# Estructura de tipos
mkdir -p src/types/{api,domain,ui}

# Estructura de constants
mkdir -p src/constants/{api,routes,roles}
```

**Verificación**:
```bash
tree src/components -I node_modules
echo "✅ Component structure created"
```

**Consideraciones de Seguridad**:
- Separación clara de responsabilidades
- Componentes atómicos y reutilizables
- Tipos TypeScript bien definidos

---

### **13.4: Implementar Sistema de Autenticación Frontend**

**Objetivo**: Manejo seguro de tokens y sesión de usuario
**Tiempo estimado**: 40 minutos
**Archivos**: src/hooks/auth/useAuth.ts, src/services/api/auth.service.ts
**Líneas máximas**: 120 líneas totales
**Tests requeridos**: 3 tests de autenticación

**Implementación**:
```typescript
// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'secretaria' | 'docente' | 'alumno';
  nombre: string;
  apellido: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
```

```typescript
// src/services/api/auth.service.ts
import axios from 'axios';
import { LoginCredentials, User, TokenPair } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: TokenPair }> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    
    // Almacenar tokens de forma segura
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
    }
    
    return response.data;
  },

  async refreshToken(): Promise<TokenPair> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refreshToken') 
      : null;
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    // Actualizar tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post(`${API_BASE_URL}/auth/logout`);
    
    // Limpiar tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  getAccessToken(): string | null {
    return typeof window !== 'undefined' 
      ? localStorage.getItem('accessToken') 
      : null;
  },
};
```

```typescript
// src/hooks/auth/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { authService } from '@/services/api/auth.service';
import { User, LoginCredentials, AuthState } from '@/types/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const queryClient = useQueryClient();

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuthState({
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        isLoading: false,
        isAuthenticated: true,
      });
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        isAuthenticated: false,
      });
      queryClient.clear();
    },
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getAccessToken();
      if (token) {
        try {
          // TODO: Implementar endpoint para validar token y obtener user
          setAuthState(prev => ({ ...prev, isLoading: false }));
        } catch (error) {
          setAuthState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = (credentials: LoginCredentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  const logout = () => {
    return logoutMutation.mutateAsync();
  };

  return {
    ...authState,
    login,
    logout,
    loginLoading: loginMutation.isPending,
    logoutLoading: logoutMutation.isPending,
  };
}
```

**Verificación**:
```bash
npm test -- --testNamePattern="Auth"
echo "✅ Frontend auth working"
```

**Consideraciones de Seguridad**:
- Tokens almacenados en localStorage (considerar httpOnly cookies)
- Refresh token rotation
- Validación de tokens en cada request
- Logout completo

---

### **13.5: Crear Dashboard Principal por Rol**

**Objetivo**: Interfaz principal adaptada por rol de usuario
**Tiempo estimado**: 45 minutos
**Archivos**: src/app/dashboard/page.tsx, src/components/layout/dashboard-layout.tsx
**Líneas máximas**: 200 líneas totales
**Tests requeridos**: 2 tests de dashboard

**Implementación**:
```typescript
// src/app/dashboard/page.tsx
'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { SecretariaDashboard } from '@/components/dashboard/secretaria-dashboard';
import { DocenteDashboard } from '@/components/dashboard/docente-dashboard';
import { AlumnoDashboard } from '@/components/dashboard/alumno-dashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirigir a login
    return <div>Redirecting to login...</div>;
  }

  // Renderizar dashboard según rol
  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'secretaria':
        return <SecretariaDashboard />;
      case 'docente':
        return <DocenteDashboard />;
      case 'alumno':
        return <AlumnoDashboard />;
      default:
        return <div>Rol no reconocido</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Instituto Paulo Freire
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.nombre} {user.apellido}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-institutional-100 text-institutional-800 rounded-full">
                {user.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderDashboard()}
      </main>
    </div>
  );
}
```

**Verificación**:
```bash
npm run dev
echo "✅ Dashboard accessible"
```

**Consideraciones de Seguridad**:
- Validación de rol en frontend
- Loading states apropiados
- Responsive design
- Accesibilidad WCAG

---

## 📱 **PASO 14: Frontend - Componentes Académicos**

### **14.1: Crear Componente de Gestión de Alumnos**

**Objetivo**: Interface completa para gestión académica
**Tiempo estimado**: 40 minutos
**Archivos**: src/components/academic/alumnos-list.tsx
**Líneas máximas**: 150 líneas
**Tests requeridos**: 3 tests de componentes

**Implementación**:
```typescript
// src/components/academic/alumnos-list.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PlusIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { Alumno } from '@/types/academic';

export function AlumnosList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  // Query para obtener alumnos
  const { data: alumnos, isLoading, error } = useQuery({
    queryKey: ['alumnos', searchTerm, filterEstado],
    queryFn: async (): Promise<Alumno[]> => {
      const response = await fetch(
        `/api/alumnos?search=${searchTerm}&estado=${filterEstado}`
      );
      if (!response.ok) throw new Error('Failed to fetch alumnos');
      return response.json();
    },
  });

  const filteredAlumnos = alumnos?.filter(alumno => {
    const matchesSearch = `${alumno.nombre} ${alumno.apellido} ${alumno.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === 'todos' || alumno.estado === filterEstado;
    return matchesSearch && matchesFilter;
  }) || [];

  if (isLoading) {
    return <div>Cargando alumnos...</div>;
  }

  if (error) {
    return <div>Error al cargar alumnos</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Alumnos</h2>
        <Button className="flex items-center space-x-2">
          <PlusIcon className="h-4 w-4" />
          <span>Nuevo Alumno</span>
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="p-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, apellido o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-institutional-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="suspendido">Suspendido</option>
            <option value="baja">Baja</option>
            <option value="egresado">Egresado</option>
          </select>
        </div>
      </Card>

      {/* Lista de alumnos */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alumno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Legajo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carrera
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlumnos.map((alumno) => (
                <tr key={alumno.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {alumno.apellido}, {alumno.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        DNI: {alumno.dni}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {alumno.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {alumno.legajo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        alumno.estado === 'activo' ? 'success' :
                        alumno.estado === 'suspendido' ? 'warning' :
                        alumno.estado === 'baja' ? 'error' : 'default'
                      }
                    >
                      {alumno.estado.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {alumno.carreraNombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
```

**Verificación**:
```bash
npm test -- --testNamePattern="AlumnosList"
echo "✅ Academic components working"
```

**Consideraciones de Seguridad**:
- Validación de datos en frontend
- Estados de carga apropiados
- Manejo de errores seguro
- Accesibilidad en tabla

---

## 🔄 **PASO 15: Integración Frontend-Backend**

### **15.1: Configurar Conexión API Segura**

**Objetivo**: Comunicación segura entre frontend y backend
**Tiempo estimado**: 30 minutos
**Archivos**: src/lib/api.ts, src/services/api/base.service.ts
**Líneas máximas**: 100 líneas totales
**Tests requeridos**: 2 tests de API

**Implementación**:
```typescript
// src/lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor para agregar token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para manejar refresh token
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = this.getAccessToken();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh token falló, redirigir a login
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await axios.post(`${this.client.defaults.baseURL}/auth/refresh`, {
      refreshToken,
    });

    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

**Verificación**:
```bash
npm test -- --testNamePattern="API Client"
echo "✅ Frontend-Backend integration working"
```

**Consideraciones de Seguridad**:
- Token injection automático
- Refresh token handling
- Request/response interceptors
- Error handling seguro

---

## ✅ **Checklist Final del Proyecto (Actualizado)**

- [ ] PASO 1-5: Backend completo y seguro
- [ ] PASO 6-12: Testing y optimización del backend
- [ ] PASO 13: Frontend base configurado
- [ ] PASO 14: Componentes académicos implementados
- [ ] PASO 15: Integración frontend-backend completa
- [ ] Todos los tests pasando con coverage > 80%
- [ ] Security scan sin vulnerabilidades críticas
- [ ] Docker-compose funcionando 100% remoto
- [ ] Variables de entorno seguras configuradas
- [ ] Logs estructurados implementados
- [ ] Health checks funcionando
- [ ] Frontend responsive y accesible
- [ ] Integración API segura y funcional
- [ ] Ready para producción full-stack

---

**🎯 Conclusión Actualizada**: Sistema full-stack enterprise-ready con seguridad desde el inicio, arquitectura modular, desarrollo 100% remoto, e interfaz moderna y accesible.

*Cada paso está diseñado ser completado independientemente con validaciones claras, seguridad enterprise, y experiencia de usuario moderna.*

---

## 🔒 **Security Checklist por Paso**

### **Validaciones Implementadas**
- ✅ Input validation en todos los DTOs
- ✅ SQL injection prevention con TypeORM
- ✅ XSS protection con helmet
- ✅ Rate limiting por endpoint
- ✅ JWT tokens con expiración corta
- ✅ Password hashing con bcrypt
- ✅ Environment variables encryption
- ✅ CORS configurado restrictivo
- ✅ Audit logging en acciones críticas
- ✅ Error handling sin información sensible

---

## ✅ **Checklist Final del Proyecto**

- [ ] PASO 1: Configuración base completada
- [ ] PASO 2: Infraestructura de datos funcionando
- [ ] PASO 3: Seguridad base implementada
- [ ] PASO 4: Módulo de autenticación completo
- [ ] PASO 5: Domain layer académico creado
- [ ] Todos los tests pasando con coverage > 80%
- [ ] Security scan sin vulnerabilidades críticas
- [ ] Docker-compose funcionando 100% remoto
- [ ] Variables de entorno seguras configuradas
- [ ] Logs estructurados implementados
- [ ] Health checks funcionando
- [ ] Documentación completa y actualizada
- [ ] Ready para producción

---

**🎯 Conclusión**: Sistema enterprise-ready con seguridad desde el inicio, arquitectura modular, y 100% remoto desde el primer commit.

*Cada paso está diseñado ser completado independientemente con validaciones claras y seguridad enterprise.*
