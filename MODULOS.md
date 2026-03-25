# 📦 **MODULOS.md**
# Estructura de Módulos y Patrones de Implementación
Instituto Superior de Formación Docente – Paulo Freire

**Stack Definitivo**: NestJS + TypeScript + PostgreSQL + Redis

---

## 🎯 **Propósito**

Definir la estructura de módulos del sistema y patrones de implementación consistentes con Clean Architecture y DDD.

---

## 📁 **Estructura General del Proyecto**

```
freire/
├── src/
│   ├── modules/                    # Módulos por bounded context
│   │   ├── auth/                  # Módulo de autenticación
│   │   ├── academic/              # Módulo académico principal
│   │   ├── financial/             # Módulo financiero
│   │   └── shared/                # Módulo compartido
│   ├── shared/                    # Componentes compartidos globales
│   ├── config/                    # Configuración por ambiente
│   ├── common/                    # Utilidades comunes
│   └── main.ts                   # Bootstrap de la aplicación
├── test/                         # Tests
├── docker/                       # Configuración Docker
├── docs/                         # Documentación
└── scripts/                      # Scripts de utilidad
```

---

## 🏗️ **Estructura de Módulo (Patrones DDD)**

### **📋 Estructura Estándar por Módulo**

```
src/modules/{module-name}/
├── domain/                      # 🧠 Lógica de negocio pura
│   ├── entities/               # Entidades del dominio
│   │   ├── {entity}.entity.ts
│   │   └── {aggregate}.entity.ts
│   ├── value-objects/          # Value Objects inmutables
│   │   └── {vo}.vo.ts
│   ├── services/               # Domain Services stateless
│   │   └── {service}.service.ts
│   ├── events/                 # Eventos de dominio
│   │   └── {event}.event.ts
│   └── repositories/           # Interfaces puras
│       └── {repo}.interface.ts
├── application/                # ⚙️ Casos de uso y orquestación
│   ├── commands/              # Comandos CQRS
│   │   └── {command}.command.ts
│   ├── queries/               # Consultas CQRS
│   │   └── {query}.query.ts
│   ├── dto/                   # Data Transfer Objects
│   │   ├── create-{resource}.dto.ts
│   │   ├── update-{resource}.dto.ts
│   │   └── response-{resource}.dto.ts
│   ├── use-cases/             # Casos de uso específicos
│   │   ├── create-{resource}.use-case.ts
│   │   ├── list-{resource}.use-case.ts
│   │   └── update-{resource}.use-case.ts
│   └── services/              # Application Services
│       └── {service}.service.ts
├── infrastructure/             # 🔧 Implementación técnica
│   ├── entities/              # Entidades TypeORM
│   │   └── {entity}.entity.ts
│   ├── repositories/          # Implementaciones de repositorios
│   │   └── {repo}.repository.ts
│   ├── strategies/            # Estrategias específicas
│   │   └── {strategy}.strategy.ts
│   ├── events/                # Event handlers
│   │   └── {event}-handler.service.ts
│   └── config/                # Configuración específica
│       └── {module}.config.ts
├── presentation/              # 🎯 Controllers y DTOs API
│   ├── controllers/           # Endpoints REST
│   │   └── {resource}.controller.ts
│   ├── dto/                   # DTOs de API
│   │   ├── {resource}-params.dto.ts
│   │   └── {resource}-query.dto.ts
│   ├── guards/                # Guards de seguridad
│   │   └── {resource}.guard.ts
│   ├── interceptors/          # Interceptors
│   │   └── {interceptor}.interceptor.ts
│   └── filters/               # Exception filters
│       └── {filter}.filter.ts
└── {module}.module.ts        # Módulo NestJS
```

---

## 🔐 **Módulo AUTH - Ejemplo Completo**

### **📁 Estructura del Módulo AUTH**

```
src/modules/auth/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── role.entity.ts
│   │   └── permission.entity.ts
│   ├── services/
│   │   ├── auth-domain.service.ts
│   │   └── password.service.ts
│   └── events/
│       ├── user-registered.event.ts
│       ├── login-attempted.event.ts
│       └── password-changed.event.ts
├── application/
│   ├── commands/
│   │   ├── login.command.ts
│   │   ├── register.command.ts
│   │   ├── refresh-token.command.ts
│   │   └── logout.command.ts
│   ├── queries/
│   │   ├── get-user.query.ts
│   │   └── validate-token.query.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   └── auth-response.dto.ts
│   └── services/
│       ├── auth.service.ts
│       └── token.service.ts
├── infrastructure/
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── role.repository.ts
│   │   └── permission.repository.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   ├── refresh-token.strategy.ts
│   │   └── local.strategy.ts
│   ├── security/
│   │   ├── jwt.service.ts
│   │   └── encryption.service.ts
│   └── events/
│       └── auth-event-handler.service.ts
├── presentation/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── users.controller.ts
│   ├── dto/
│   │   ├── login-params.dto.ts
│   │   └── register-params.dto.ts
│   └── guards/
│       ├── jwt-auth.guard.ts
│       └── roles.guard.ts
└── auth.module.ts
```

### **🧠 Domain Layer - AUTH**

#### **Entidad de Dominio**
```typescript
// src/modules/auth/domain/entities/user.entity.ts
export class User {
  constructor(
    readonly id: number,
    readonly email: string,
    readonly username: string,
    private _passwordHash: string,
    private _isActive: boolean,
    readonly roles: Role[],
    readonly createdAt: Date
  ) {}

  get isActive(): boolean {
    return this._isActive;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  activate(): void {
    this._isActive = true;
  }

  deactivate(): void {
    this._isActive = false;
  }

  hasRole(roleName: string): boolean {
    return this.roles.some(role => role.name === roleName);
  }

  hasPermission(permissionName: string): boolean {
    return this.roles.some(role => 
      role.permissions.some(permission => permission.name === permissionName)
    );
  }
}
```

#### **Domain Service**
```typescript
// src/modules/auth/domain/services/auth-domain.service.ts
export interface IAuthService {
  validateCredentials(email: string, password: string): Promise<User | null>;
  generateTokens(user: User): Promise<TokenPair>;
  refreshToken(refreshToken: string): Promise<TokenPair>;
}

export class AuthDomainService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private tokenService: ITokenService
  ) {}

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await this.passwordService.validate(password, user.passwordHash);
    
    return isValidPassword ? user : null;
  }

  async generateTokens(user: User): Promise<TokenPair> {
    return {
      accessToken: await this.tokenService.generateAccessToken(user),
      refreshToken: await this.tokenService.generateRefreshToken(user)
    };
  }
}
```

### **⚙️ Application Layer - AUTH**

#### **Use Case**
```typescript
// src/modules/auth/application/use-cases/login.use-case.ts
@Injectable()
export class LoginUseCase {
  constructor(
    private authService: IAuthService,
    private userRepository: IUserRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(command: LoginCommand): Promise<AuthResponse> {
    // Validar credenciales
    const user = await this.authService.validateCredentials(command.email, command.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar tokens
    const tokens = await this.authService.generateTokens(user);

    // Disparar evento de dominio
    this.eventPublisher.emit('user.login_attempted', new LoginAttemptedEvent(user.id));

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles.map(role => role.name)
      },
      tokens
    };
  }
}
```

### **🎯 Presentation Layer - AUTH**

#### **Controller**
```typescript
// src/modules/auth/presentation/controllers/auth.controller.ts
@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    const command = new LoginCommand(loginDto.email, loginDto.password);
    return this.loginUseCase.execute(command);
  }
}
```

---

## 🎓 **Módulo ACADEMIC - Estructura**

### **📁 Componentes Principales**

```
src/modules/academic/
├── domain/
│   ├── entities/
│   │   ├── alumno.entity.ts
│   │   ├── inscripcion.entity.ts
│   │   ├── comision.entity.ts
│   │   ├── materia.entity.ts
│   │   ├── mesa-examen.entity.ts
│   │   └── acta.entity.ts
│   ├── services/
│   │   ├── inscripcion-validation.service.ts
│   │   ├── correlatividad.service.ts
│   │   └── regularidad.service.ts
│   └── events/
│       ├── inscripcion-creada.event.ts
│       ├── inscripcion-confirmada.event.ts
│       └── regularidad-cambiada.event.ts
├── application/
│   ├── use-cases/
│   │   ├── crear-inscripcion.use-case.ts
│   │   ├── listar-inscripciones.use-case.ts
│   │   ├── cancelar-inscripcion.use-case.ts
│   │   ├── generar-acta.use-case.ts
│   │   └── calcular-regularidad.use-case.ts
│   └── dto/
│       ├── inscripcion.dto.ts
│       ├── comision.dto.ts
│       └── acta.dto.ts
├── infrastructure/
│   ├── repositories/
│   │   ├── alumno.repository.ts
│   │   ├── inscripcion.repository.ts
│   │   └── comision.repository.ts
│   └── events/
│       └── academic-event-handler.service.ts
└── presentation/
    ├── controllers/
    │   ├── inscripciones.controller.ts
    │   ├── comisiones.controller.ts
    │   ├── mesas-examen.controller.ts
    │   └── actas.controller.ts
    └── dto/
        ├── inscripcion-params.dto.ts
        └── mesa-examen-params.dto.ts
```

---

## 💰 **Módulo FINANCIAL - Estructura**

### **📁 Componentes Principales**

```
src/modules/financial/
├── domain/
│   ├── entities/
│   │   ├── pago.entity.ts
│   │   ├── beca.entity.ts
│   │   ├── cuota.entity.ts
│   │   └── deuda.entity.ts
│   ├── services/
│   │   ├── calculo-deuda.service.ts
│   │   ├── aplicacion-beca.service.ts
│   │   └── procesamiento-pago.service.ts
│   └── events/
│       ├── pago-registrado.event.ts
│       ├── beca-aplicada.event.ts
│       └── deuda-actualizada.event.ts
├── application/
│   ├── use-cases/
│   │   ├── registrar-pago.use-case.ts
│   │   ├── aplicar-beca.use-case.ts
│   │   ├── calcular-deuda.use-case.ts
│   │   └── generar-recibo.use-case.ts
│   └── dto/
│       ├── pago.dto.ts
│       ├── beca.dto.ts
│       └── deuda.dto.ts
├── infrastructure/
│   ├── repositories/
│   │   ├── pago.repository.ts
│   │   ├── beca.repository.ts
│   │   └── deuda.repository.ts
│   └── events/
│       └── financial-event-handler.service.ts
└── presentation/
    ├── controllers/
    │   ├── pagos.controller.ts
    │   ├── becas.controller.ts
    │   └── reportes-financieros.controller.ts
    └── dto/
        ├── pago-params.dto.ts
        └── beca-params.dto.ts
```

---

## 🔄 **Patrones de Comunicación Entre Módulos**

### **📡 Eventos de Dominio Cruzados**

```typescript
// Evento desde Academic Module
export class InscripcionConfirmadaEvent {
  constructor(
    readonly inscripcionId: number,
    readonly alumnoId: number,
    readonly comisionId: number
  ) {}
}

// Handler en Financial Module
@Injectable()
export class FinancialEventHandler {
  @OnEvent('inscripcion.confirmada')
  async handleInscripcionConfirmada(event: InscripcionConfirmadaEvent) {
    // Verificar si el alumno tiene deuda
    const deuda = await this.deudaService.calcularDeuda(event.alumnoId);
    
    if (deuda.total > 0) {
      // Bloquear futuras inscripciones si hay deuda
      await this.alumnoService.actualizarEstadoFinanciero(event.alumnoId, 'Con Deuda');
    }
  }
}
```

### **🔗 Domain Services Compartidos**

```typescript
// src/shared/domain/services/validacion-usuario.service.ts
export interface IValidacionUsuarioService {
  usuarioEstaActivo(usuarioId: number): Promise<boolean>;
  usuarioTienePermiso(usuarioId: number, permiso: string): Promise<boolean>;
}

// Implementación en AUTH Module
@Injectable()
export class ValidacionUsuarioService implements IValidacionUsuarioService {
  constructor(private userRepository: IUserRepository) {}

  async usuarioEstaActivo(usuarioId: number): Promise<boolean> {
    const user = await this.userRepository.findById(usuarioId);
    return user?.isActive || false;
  }

  async usuarioTienePermiso(usuarioId: number, permiso: string): Promise<boolean> {
    const user = await this.userRepository.findById(usuarioId);
    return user?.hasPermission(permiso) || false;
  }
}
```

---

## 📋 **Guía de Creación de Nuevos Módulos**

### **🔧 Pasos para Crear un Módulo**

#### **1️⃣ Crear Estructura Base**
```bash
mkdir -p src/modules/{module-name}/{domain,application,infrastructure,presentation}
mkdir -p src/modules/{module-name}/domain/{entities,services,events,repositories}
mkdir -p src/modules/{module-name}/application/{use-cases,dto}
mkdir -p src/modules/{module-name}/infrastructure/{repositories,events}
mkdir -p src/modules/{module-name}/presentation/{controllers,dto}
```

#### **2️⃣ Definir Entidades de Dominio**
```typescript
// src/modules/{module-name}/domain/entities/{entity}.entity.ts
export class {Entity} {
  constructor(
    readonly id: number,
    // Propiedades readonly
    private _estado: string,
    // Propiedades privadas con getters
  ) {}

  get estado(): string {
    return this._estado;
  }

  // Métodos de dominio
  cambiarEstado(nuevoEstado: string): void {
    // Validaciones y lógica de negocio
    this._estado = nuevoEstado;
  }
}
```

#### **3️⃣ Crear Use Cases**
```typescript
// src/modules/{module-name}/application/use-cases/{action}.use-case.ts
@Injectable()
export class {Action}UseCase {
  constructor(
    private repository: I{Entity}Repository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(command: {Action}Command): Promise<{Entity}> {
    // Lógica de orquestación
    const entity = new {Entity}(...command.params);
    const saved = await this.repository.save(entity);
    
    // Eventos de dominio
    this.eventPublisher.emit('{event}.created', new {Entity}CreatedEvent(saved.id));
    
    return saved;
  }
}
```

#### **4️⃣ Implementar Repository**
```typescript
// src/modules/{module-name}/infrastructure/repositories/{entity}.repository.ts
@Injectable()
export class {Entity}Repository implements I{Entity}Repository {
  constructor(@InjectRepository({Entity}Entity) private repo: Repository<{Entity}Entity>) {}

  async save(entity: {Entity}): Promise<{Entity}> {
    const entityData = this.toEntity(entity);
    const saved = await this.repo.save(entityData);
    return this.toDomain(saved);
  }

  private toEntity(entity: {Entity}): Partial<{Entity}Entity> {
    return {
      // Mapeo de domain a infrastructure
    };
  }

  private toDomain(entity: {Entity}Entity): {Entity} {
    return new {Entity}(
      // Mapeo de infrastructure a domain
    );
  }
}
```

#### **5️⃣ Crear Controller**
```typescript
// src/modules/{module-name}/presentation/controllers/{entity}.controller.ts
@Controller('{entity-plural}')
@ApiTags('{Entity Plural}')
export class {Entity}Controller {
  constructor(private {action}UseCase: {Action}UseCase) {}

  @Post()
  async create(@Body() dto: Create{Entity}Dto) {
    const command = new {Action}Command(dto);
    return this.{action}UseCase.execute(command);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    // Implementación
  }
}
```

#### **6️⃣ Configurar Módulo**
```typescript
// src/modules/{module-name}/{module-name}.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([{Entity}Entity])
  ],
  controllers: [{Entity}Controller],
  providers: [
    // Repositories
    { provide: I{Entity}Repository, useClass: {Entity}Repository },
    
    // Use Cases
    {Action}UseCase,
    
    // Services
    {Entity}Service,
    
    // Event Handlers
    {Entity}EventHandler
  ],
  exports: [
    {Entity}Service,
    I{Entity}Repository
  ]
})
export class {ModuleName}Module {}
```

---

## 🎯 **Mejores Prácticas**

### **✅ Reglas de Oro**

1. **Domain Layer Puro**: Sin dependencias externas (TypeORM, HTTP, etc.)
2. **Interfaces en Domain**: Repositorios y servicios como interfaces puras
3. **Implementaciones en Infrastructure**: Clases concretas con dependencias técnicas
4. **DTOs separados**: Application DTOs vs Presentation DTOs
5. **Eventos de Dominio**: Para comunicación asíncrona entre módulos
6. **Use Cases Específicos**: Un caso de uso por acción principal
7. **Controllers Delgados**: Solo validación y delegación a use cases

### **🚫 Anti-Patrones a Evitar**

1. **❌ Lógica de negocio en Controllers**
2. **❌ Dependencias directas entre módulos**
3. **❌ Repositorios concretos en Domain Layer**
4. **❌ DTOs compartidos entre capas**
5. **❌ Use Cases con múltiples responsabilidades**
6. **❌ Event handlers con lógica de dominio**
7. **❌ Entities de TypeORM en Application Layer**

---

## 📊 **Métricas de Calidad por Módulo**

| Métrica | Meta | Verificación |
|---------|------|--------------|
| **Coverage** | > 80% | Tests unitarios + integración |
| **Complexity** | < 10 | Cyclomatic complexity |
| **Dependencies** | < 5 | Dependencias externas por clase |
| **Performance** | < 200ms | Response time promedio |
| **Security** | 100% | Todos los endpoints protegidos |

---

## 🔄 **Evolución de Módulos**

### **📈 Fases de Implementación**

1. **Fase 1**: Módulo AUTH completo
2. **Fase 2**: Módulo Academic core
3. **Fase 3**: Módulo Financial básico
4. **Fase 4**: Integración entre módulos
5. **Fase 5**: Módulos especializados (Reportes, Auditoría)

### **🎯 Roadmap de Expansión**

- **Short Term** (1-2 meses): AUTH + Academic básico
- **Medium Term** (3-4 meses): Financial + Integración completa
- **Long Term** (5-6 meses): Reportes + Analytics + Optimización

---

*Esta estructura de módulos garantiza consistencia, mantenibilidad y escalabilidad del sistema a largo plazo.*
