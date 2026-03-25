# SETUP_INICIAL.md
# Setup Inicial del Proyecto
Instituto Superior de Formación Docente – Paulo Freire

**Stack**: NestJS + TypeScript + PostgreSQL + Redis

---

## 🚀 Comandos de Setup Inicial

### 1. Crear Proyecto Base
```bash
# Instalar NestJS CLI globalmente
npm install -g @nestjs/cli

# Crear nuevo proyecto
nest new freire --package-manager npm --strict
cd freire

# Instalar dependencias principales
npm install @nestjs/core @nestjs/common @nestjs/platform-express
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/jwt @nestjs/passport @nestjs/config
npm install @nestjs/throttler helmet compression
npm install passport passport-jwt bcrypt
npm install class-validator class-transformer
npm install @nestjs/event-emitter ioredis uuid
npm install reflect-metadata

# Dependencias de desarrollo
npm install --save-dev @nestjs/testing jest @types/jest
npm install --save-dev rimraf prettier eslint @types/bcrypt @types/uuid
```

### 2. Configurar Estructura Base
```bash
# Crear estructura de módulos
mkdir -p src/modules/academic/{domain,application,infrastructure,presentation}
mkdir -p src/modules/academic/domain/{aggregates,services,events}
mkdir -p src/modules/academic/application/{commands,queries,services}
mkdir -p src/modules/academic/infrastructure/{repositories,events,security}
mkdir -p src/modules/academic/presentation/{controllers,dto,guards}
mkdir -p src/shared/{domain,infrastructure,presentation}
mkdir -p test/{unit,integration,e2e}
mkdir -p docs docker scripts
```

### 3. Configurar TypeORM (Moderno v0.3+)
```bash
# Crear configuración de base de datos moderna
mkdir -p src/config
cat > src/config/database.config.ts << EOF
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    process.env.NODE_ENV === 'development'
      ? 'src/**/*.entity.ts'
      : 'dist/**/*.entity.js'
  ],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
EOF
```

### 4. Configurar Variables de Entorno
```bash
# Crear .env.example
cat > .env.example << EOF
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=freire
DB_PASSWORD=password
DB_DATABASE=freire_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRATION=3600
JWT_REFRESH_EXPIRATION=604800

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# App
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
EOF

# Copiar a .env
cp .env.example .env
```

### 5. Configurar Docker para Desarrollo
```bash
# Crear docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: freire_db
      POSTGRES_USER: freire
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
EOF
```

### 6. Scripts de Desarrollo
```bash
# Actualizar package.json con scripts de desarrollo
# NOTA: Esto debe agregarse dentro del objeto "scripts" existente en package.json

# Scripts para package.json:
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "typeorm": "typeorm-ts-node-commonjs -d src/config/database.config.ts",
    "migration:generate": "npm run typeorm -- migration:generate src/migrations/InitialCreate",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  }
}
```

### 7. Configuración de Seguridad Base
```bash
# Configurar main.ts con seguridad mínima
cat > src/main.ts << EOF
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad base
  app.use(helmet());
  app.use(compression());
  
  // Validación estricta
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
EOF
```

### 8. Configuración TypeORM en AppModule
```bash
# Configurar TypeOrmModule.forRootAsync en app.module.ts
cat > src/app.module.ts << EOF
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config/database.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...AppDataSource.options,
      }),
    }),
  ],
})
export class AppModule {}
EOF
```

### 9. Configuración Redis (Opcional pero recomendado)
```bash
# Crear módulo Redis
mkdir -p src/modules/redis
cat > src/modules/redis/redis.module.ts << EOF
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const Redis = require('ioredis');
        return new Redis({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
EOF
```

### Iniciar Desarrollo
```bash
# Levantar servicios
npm run docker:up

# Esperar 10 segundos para que inicien
sleep 10

# Generar migraciones iniciales
npm run migration:generate -- -n InitialCreate

# Ejecutar migraciones
npm run migration:run

# Iniciar desarrollo
npm run start:dev
```

### Crear Nuevo Módulo
```bash
# Ejemplo: Crear módulo de usuarios
nest generate module users
nest generate controller users
nest generate service users
nest generate entity users
```

### Testing
```bash
# Correr todos los tests
npm test

# Tests con cobertura
npm run test:cov

# Tests en modo watch
npm run test:watch
```

---

## 🧪 Decisión Estratégica: TypeORM vs Prisma

### 📋 Opciones Disponibles

**TypeORM** (Recomendado para DDD puro):
- ✅ Más tradicional y estable
- ✅ Mayor flexibilidad para DDD
- ✅ Control total sobre queries
- ✅ Mejor para aggregates complejos

**Prisma** (Alternativa moderna):
- ✅ Mejor developer experience
- ✅ Type safety extremo
- ✅ Menos boilerplate
- ✅ Queries optimizadas automáticamente

### 🎯 Recomendación para este Proyecto

**TypeORM** - Por qué:
- DDD con aggregates complejos
- Control total sobre persistencia
- Flexibilidad para Event Store
- Mejor alineación con Clean Architecture

---

## 🚀 Próximos Pasos Críticos

### 1️⃣ Módulo AUTH Primero
Antes de cualquier módulo de negocio:
- Implementar JWT con refresh tokens
- Configurar guards y middleware
- Crear ABAC policies
- Tests de seguridad exhaustivos

### 2️⃣ Estructura Definitiva
- Módulos por bounded context
- Clean Architecture estricta
- Domain Services para reglas cruzadas
- Event Store simplificado

### 3️⃣ Primer Módulo de Negocio
- Academic module con aggregates
- Validaciones de dominio
- Tests unitarios e integración

---

## 📋 Checklist de Setup Profesional

- [ ] Proyecto NestJS creado con --strict
- [ ] Dependencias completas instaladas
- [ ] TypeORM v0.3+ con DataSource
- [ ] Seguridad base configurada (helmet, compression, validation)
- [ ] Variables de entorno completas
- [ ] Docker compose funcionando
- [ ] Scripts de desarrollo correctos
- [ ] Estructura de carpetas DDD
- [ ] Módulo AUTH implementado
- [ ] Tests configurados

---

## 🎯 Conclusión

**Setup profesional listo para desarrollo real con**:
- ✅ TypeORM moderno v0.3+
- ✅ Seguridad enterprise desde el inicio
- ✅ Estructura DDD/Clean Architecture
- ✅ Dependencias completas y actualizadas
- ✅ Configuración profesional sin improvisaciones

**El proyecto está listo para implementación seria.**
