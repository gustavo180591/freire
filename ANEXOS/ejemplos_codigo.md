# ========================================
# 5️⃣ MODULE CONFIGURATION - Módulo Completo
# ========================================

// src/modules/academic/academic.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Domain Layer
import { IInscripcionRepository } from './domain/repositories/inscripcion.repository.interface';
import { IAlumnoRepository } from './domain/repositories/alumno.repository.interface';
import { IComisionRepository } from './domain/repositories/comision.repository.interface';
import { IFinancieroRepository } from './domain/repositories/financiero.repository.interface';
import { ICorrelatividadRepository } from './domain/repositories/correlatividad.repository.interface';
import { IInscripcionValidationService } from './domain/services/inscripcion-validation.service';
import { InscripcionValidationService } from './domain/services/inscripcion-validation.service';

// Application Layer
import { CrearInscripcionUseCase } from './application/use-cases/crear-inscripcion.use-case';
import { ListarInscripcionesUseCase } from './application/use-cases/listar-inscripciones.use-case';
import { CancelarInscripcionUseCase } from './application/use-cases/cancelar-inscripcion.use-case';
import { InscripcionService } from './application/services/inscripcion.service';

// Infrastructure Layer
import { InscripcionRepository } from './infrastructure/repositories/inscripcion.repository';
import { AlumnoRepository } from './infrastructure/repositories/alumno.repository';
import { ComisionRepository } from './infrastructure/repositories/comision.repository';
import { FinancieroRepository } from './infrastructure/repositories/financiero.repository';
import { CorrelatividadRepository } from './infrastructure/repositories/correlatividad.repository';
import { InscripcionEventHandler } from './infrastructure/event-handlers/inscripcion.event-handler';
import { InscripcionEntity } from './infrastructure/entities/inscripcion.entity';
import { AlumnoEntity } from './infrastructure/entities/alumno.entity';
import { ComisionEntity } from './infrastructure/entities/comision.entity';

// Presentation Layer
import { InscripcionController } from './presentation/controllers/inscripcion.controller';
import { InscripcionResponseInterceptor } from './presentation/interceptors/inscripcion.interceptor';
import { InscripcionExceptionFilter } from './presentation/filters/inscripcion.exception.filter';
import { InscripcionValidationPipe } from './presentation/pipes/inscripcion-validation.pipe';

// Shared
import { AuditoriaService } from '../shared/infrastructure/services/auditoria.service';
import { NotificationService } from '../shared/infrastructure/services/notification.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      InscripcionEntity,
      AlumnoEntity,
      ComisionEntity
    ])
  ],
  controllers: [
    InscripcionController
  ],
  providers: [
    // Repositories (Infrastructure)
    {
      provide: IInscripcionRepository,
      useClass: InscripcionRepository
    },
    {
      provide: IAlumnoRepository,
      useClass: AlumnoRepository
    },
    {
      provide: IComisionRepository,
      useClass: ComisionRepository
    },
    {
      provide: IFinancieroRepository,
      useClass: FinancieroRepository
    },
    {
      provide: ICorrelatividadRepository,
      useClass: CorrelatividadRepository
    },

    // Domain Services
    {
      provide: IInscripcionValidationService,
      useClass: InscripcionValidationService
    },

    // Application Services (Use Cases)
    CrearInscripcionUseCase,
    ListarInscripcionesUseCase,
    CancelarInscripcionUseCase,
    InscripcionService,

    // Event Handlers
    InscripcionEventHandler,

    // Shared Services
    AuditoriaService,
    NotificationService,

    // Presentation Layer
    InscripcionResponseInterceptor,
    InscripcionExceptionFilter,
    InscripcionValidationPipe
  ],
  exports: [
    InscripcionService,
    IInscripcionRepository,
    IInscripcionValidationService
  ]
})
export class AcademicModule {}

// ========================================
# 6️⃣ SHARED LAYER - Componentes Compartidos
# ========================================

// src/shared/domain/result.ts
export class Result<T> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value?: T,
    public readonly error?: string
  ) {}

  static success<T>(value: T): Result<T> {
    return new Result(true, value);
  }

  static failure<T>(error: string): Result<T> {
    return new Result(false, undefined, error);
  }

  get isSuccess(): boolean {
    return this.isSuccess;
  }

  get isFailure(): boolean {
    return !this.isSuccess;
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value from failed result');
    }
    return this.value!;
  }

  getError(): string {
    if (this.isSuccess) {
      throw new Error('Cannot get error from successful result');
    }
    return this.error!;
  }
}

// src/shared/infrastructure/services/auditoria.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditoriaService {
  async registrarAccion(data: {
    entidad: string;
    entidadId: number;
    accion: string;
    detalles: string;
    usuarioId?: number;
  }): Promise<void> {
    // Implementación real de auditoría
    console.log(`AUDITORÍA: ${data.accion} - ${data.entidad}:${data.entidadId}`);
    
    // Aquí iría la lógica real:
    // await this.auditoriaRepository.create({
    //   entidad: data.entidad,
    //   entidadId: data.entidadId,
    //   accion: data.accion,
    //   detalles: data.detalles,
    //   usuarioId: data.usuarioId,
    //   fecha: new Date(),
    //   ipAddress: 'IP_DEL_USUARIO',
    //   userAgent: 'USER_AGENT_DEL_USUARIO'
    // });
  }
}

// src/shared/infrastructure/services/notification.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  async notificarInscripcionCreada(alumnoId: number, comisionId: number): Promise<void> {
    // Implementación real de notificaciones
    console.log(`NOTIFICACIÓN: Inscripción creada para alumno ${alumnoId} en comisión ${comisionId}`);
    
    // Aquí iría la lógica real:
    // - Enviar email al alumno
    // - Enviar notificación push
    // - Actualizar dashboard en tiempo real
  }
}

// src/shared/presentation/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// src/shared/presentation/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// src/shared/presentation/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// ========================================
# 7️⃣ INTERFACES DE REPOSITORIOS (Domain)
# ========================================

// src/modules/academic/domain/repositories/inscripcion.repository.interface.ts
import { Inscripcion } from '../entities/inscripcion.entity';
import { ListarInscripcionesQuery } from '../../application/queries/listar-inscripciones.query';

export interface IInscripcionRepository {
  save(inscripcion: Inscripcion): Promise<Inscripcion>;
  findById(id: number): Promise<Inscripcion | null>;
  findByAlumnoYComision(alumnoId: number, comisionId: number): Promise<Inscripcion | null>;
  findAllWithFilters(query: ListarInscripcionesQuery): Promise<{ inscripciones: Inscripcion[], total: number }>;
  findByAlumno(alumnoId: number): Promise<Inscripcion[]>;
  findByComision(comisionId: number): Promise<Inscripcion[]>;
  countByComision(comisionId: number): Promise<number>;
}

// src/modules/academic/domain/repositories/alumno.repository.interface.ts
export interface IAlumnoRepository {
  findById(id: number): Promise<any>;
  materiaAprobada(alumnoId: number, materiaId: number): Promise<boolean>;
}

// src/modules/academic/domain/repositories/comision.repository.interface.ts
export interface IComisionRepository {
  findById(id: number): Promise<any>;
  incrementarInscripciones(comisionId: number): Promise<void>;
}

// src/modules/academic/domain/repositories/financiero.repository.interface.ts
export interface IFinancieroRepository {
  tieneDeuda(alumnoId: number): Promise<boolean>;
}

// src/modules/academic/domain/repositories/correlatividad.repository.interface.ts
export interface ICorrelatividadRepository {
  obtenerPorMateria(materiaId: number): Promise<any[]>;
}

// ========================================
# 8️⃣ TESTING
# ========================================

// src/modules/academic/test/inscripcion.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { InscripcionController } from '../presentation/controllers/inscripcion.controller';
import { InscripcionService } from '../application/services/inscripcion.service';
import { Result } from 'src/shared/domain/result';

describe('InscripcionController', () => {
  let controller: InscripcionController;
  let service: InscripcionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscripcionController],
      providers: [
        {
          provide: InscripcionService,
          useValue: {
            crearInscripcion: jest.fn(),
            listarInscripciones: jest.fn(),
            cancelarInscripcion: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InscripcionController>(InscripcionController);
    service = module.get<InscripcionService>(InscripcionService);
  });

  describe('crearInscripcion', () => {
    it('debe crear una inscripción exitosamente', async () => {
      const crearDto = {
        alumnoId: 1,
        comisionId: 1,
        observaciones: 'Test'
      };

      const mockInscripcion = {
        id: 1,
        alumnoId: 1,
        comisionId: 1,
        estado: 'Pendiente',
        fechaInscripcion: new Date(),
        intentosBloqueados: 0
      };

      jest.spyOn(service, 'crearInscripcion').mockResolvedValue(
        Result.success(mockInscripcion as any)
      );

      const result = await controller.crearInscripcion(crearDto);

      expect(result).toEqual({
        success: true,
        message: 'Inscripción creada exitosamente',
        data: expect.objectContaining({
          id: 1,
          alumnoId: 1,
          comisionId: 1
        })
      });

      expect(service.crearInscripcion).toHaveBeenCalledWith({
        alumnoId: 1,
        comisionId: 1,
        observaciones: 'Test'
      });
    });

    it('debe manejar errores de validación', async () => {
      const crearDto = {
        alumnoId: 1,
        comisionId: 1
      };

      jest.spyOn(service, 'crearInscripcion').mockResolvedValue(
        Result.failure('Validación fallida: Alumno inactivo')
      );

      await expect(controller.crearInscripcion(crearDto)).rejects.toThrow();
    });
  });
});

// ========================================
# 9️⃣ ENDPOINTS API DOCUMENTATION
# ========================================

/**
 * @api {post} /inscripciones Crear Inscripción
 * @apiName CrearInscripcion
 * @apiGroup Inscripciones
 * @apiDescription Crea una nueva inscripción académica con validaciones de dominio
 * 
 * @apiParam {Number} alumnoId ID del alumno a inscribir
 * @apiParam {Number} comisionId ID de la comisión donde se inscribe
 * @apiParam {String} [observaciones] Observaciones adicionales
 * 
 * @apiParamExample {json} Request:
 * {
 *   "alumnoId": 123,
 *   "comisionId": 456,
 *   "observaciones": "Alumno regular, sin deuda"
 * }
 * 
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {String} message Mensaje descriptivo
 * @apiSuccess {Object} data Datos de la inscripción creada
 * @apiSuccess {Number} data.id ID de la inscripción
 * @apiSuccess {Number} data.alumnoId ID del alumno
 * @apiSuccess {Number} data.comisionId ID de la comisión
 * @apiSuccess {String} data.estado Estado de la inscripción
 * @apiSuccess {String} data.fechaInscripcion Fecha de creación
 * 
 * @apiSuccessExample {json} Response:
 * {
 *   "success": true,
 *   "message": "Inscripción creada exitosamente",
 *   "data": {
 *     "id": 789,
 *     "alumnoId": 123,
 *     "comisionId": 456,
 *     "estado": "Pendiente",
 *     "fechaInscripcion": "2024-03-15T10:30:00Z",
 *     "intentosBloqueados": 0
 *   }
 * }
 * 
 * @apiError (400) BadRequest Datos inválidos o validación fallida
 * @apiError (409) Conflict Inscripción duplicada o conflicto
 * @apiError (500) InternalServerError Error interno del servidor
 */

/**
 * @api {get} /inscripciones Listar Inscripciones
 * @apiName ListarInscripciones
 * @apiGroup Inscripciones
 * @apiDescription Obtiene lista de inscripciones con filtros y paginación
 * 
 * @apiParam {Number} [alumnoId] Filtrar por alumno
 * @apiParam {Number} [comisionId] Filtrar por comisión
 * @apiParam {String} [estado] Filtrar por estado
 * @apiParam {Number} [page=1] Número de página
 * @apiParam {Number} [limit=20] Registros por página
 * 
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {String} message Mensaje descriptivo
 * @apiSuccess {Array} data Lista de inscripciones
 * @apiSuccess {Object} pagination Información de paginación
 * @apiSuccess {Number} pagination.total Total de registros
 * @apiSuccess {Number} pagination.totalPages Total de páginas
 */

/**
 * @api {delete} /inscripciones/:id Cancelar Inscripción
 * @apiName CancelarInscripcion
 * @apiGroup Inscripciones
 * @apiDescription Cancela una inscripción existente
 * 
 * @apiParam {Number} id ID de la inscripción a cancelar
 * @apiParam {String} motivo Motivo de la cancelación
 * 
 * @apiParamExample {json} Request:
 * {
 *   "motivo": "El alumno solicitó baja por motivos personales"
 * }
 * 
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {String} message Mensaje descriptivo
 * @apiSuccess {Object} data Datos de la inscripción cancelada
 * 
 * @apiError (404) NotFound Inscripción no encontrada
 * @apiError (400) BadRequest No se puede cancelar la inscripción
 */
