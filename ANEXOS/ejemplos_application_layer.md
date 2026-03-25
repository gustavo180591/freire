# ========================================
# 2️⃣ APPLICATION LAYER - Casos de Uso y Orquestación
# ========================================

// src/modules/academic/application/dto/crear-inscripcion.dto.ts
import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrearInscripcionDto {
  @IsNumber()
  @IsNotEmpty()
  alumnoId: number;

  @IsNumber()
  @IsNotEmpty()
  comisionId: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

// src/modules/academic/application/dto/inscripcion-response.dto.ts
export class InscripcionResponseDto {
  id: number;
  alumnoId: number;
  comisionId: number;
  estado: string;
  fechaInscripcion: Date;
  intentosBloqueados: number;
  observaciones?: string;

  static fromEntity(inscripcion: any): InscripcionResponseDto {
    return {
      id: inscripcion.id,
      alumnoId: inscripcion.alumnoId,
      comisionId: inscripcion.comisionId,
      estado: inscripcion.estado,
      fechaInscripcion: inscripcion.fechaInscripcion,
      intentosBloqueados: inscripcion.intentosBloqueados,
      observaciones: inscripcion.observaciones
    };
  }
}

// src/modules/academic/application/commands/crear-inscripcion.command.ts
export class CrearInscripcionCommand {
  constructor(
    readonly alumnoId: number,
    readonly comisionId: number,
    readonly observaciones?: string
  ) {}
}

// src/modules/academic/application/queries/listar-inscripciones.query.ts
export class ListarInscripcionesQuery {
  constructor(
    readonly alumnoId?: number,
    readonly comisionId?: number,
    readonly estado?: string,
    readonly page: number = 1,
    readonly limit: number = 20
  ) {}
}

// src/modules/academic/application/use-cases/crear-inscripcion.use-case.ts
import { Injectable } from '@nestjs/common';
import { Result } from 'src/shared/domain/result';
import { Inscripcion } from '../../domain/entities/inscripcion.entity';
import { InscripcionCreadaEvent, InscripcionConfirmadaEvent } from '../../domain/events/inscripcion.events';
import { IInscripcionRepository } from '../../domain/repositories/inscripcion.repository.interface';
import { IInscripcionValidationService } from '../../domain/services/inscripcion-validation.service';
import { CrearInscripcionCommand } from '../commands/crear-inscripcion.command';
import { EventPublisher } from '@nestjs/event-emitter';

@Injectable()
export class CrearInscripcionUseCase {
  constructor(
    private readonly inscripcionRepository: IInscripcionRepository,
    private readonly validationService: IInscripcionValidationService,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: CrearInscripcionCommand): Promise<Result<Inscripcion>> {
    try {
      // Validaciones de dominio
      const validationResult = await this.validationService
        .validarInscripcion(command.alumnoId, command.comisionId);
      
      if (!validationResult.isValid) {
        return Result.failure(`Validación fallida: ${validationResult.errores.join(', ')}`);
      }

      // Verificar inscripción duplicada
      const existeInscripcion = await this.inscripcionRepository
        .findByAlumnoYComision(command.alumnoId, command.comisionId);
      
      if (existeInscripcion && existeInscripcion.puedeModificarse()) {
        return Result.failure('El alumno ya tiene una inscripción activa en esta comisión');
      }

      // Crear inscripción
      const inscripcion = new Inscripcion(
        0, // ID asignado por repositorio
        command.alumnoId,
        command.comisionId,
        'Pendiente' as any,
        new Date(),
        0
      );

      const inscripcionCreada = await this.inscripcionRepository.save(inscripcion);

      // Publicar eventos de dominio
      this.eventPublisher.emit(
        'inscripcion.creada',
        new InscripcionCreadaEvent(inscripcionCreada.id, command.alumnoId, command.comisionId)
      );

      return Result.success(inscripcionCreada);
    } catch (error) {
      return Result.failure(`Error al crear inscripción: ${error.message}`);
    }
  }
}

// src/modules/academic/application/use-cases/listar-inscripciones.use-case.ts
import { Injectable } from '@nestjs/common';
import { Result } from 'src/shared/domain/result';
import { InscripcionResponseDto } from '../dto/inscripcion-response.dto';
import { IInscripcionRepository } from '../../domain/repositories/inscripcion.repository.interface';
import { ListarInscripcionesQuery } from '../queries/listar-inscripciones.query';

@Injectable()
export class ListarInscripcionesUseCase {
  constructor(
    private readonly inscripcionRepository: IInscripcionRepository
  ) {}

  async execute(query: ListarInscripcionesQuery): Promise<Result<{ inscripciones: InscripcionResponseDto[], total: number }>> {
    try {
      const { inscripciones, total } = await this.inscripcionRepository
        .findAllWithFilters(query);

      const inscripcionesDto = inscripciones.map(inscripcion => 
        InscripcionResponseDto.fromEntity(inscripcion)
      );

      return Result.success({ inscripciones: inscripcionesDto, total });
    } catch (error) {
      return Result.failure(`Error al listar inscripciones: ${error.message}`);
    }
  }
}

// src/modules/academic/application/use-cases/cancelar-inscripcion.use-case.ts
import { Injectable } from '@nestjs/common';
import { Result } from 'src/shared/domain/result';
import { Inscripcion } from '../../domain/entities/inscripcion.entity';
import { InscripcionRechazadaEvent } from '../../domain/events/inscripcion.events';
import { IInscripcionRepository } from '../../domain/repositories/inscripcion.repository.interface';
import { EventPublisher } from '@nestjs/event-emitter';

@Injectable()
export class CancelarInscripcionUseCase {
  constructor(
    private readonly inscripcionRepository: IInscripcionRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(inscripcionId: number, motivo: string): Promise<Result<Inscripcion>> {
    try {
      const inscripcion = await this.inscripcionRepository.findById(inscripcionId);
      
      if (!inscripcion) {
        return Result.failure('Inscripción no encontrada');
      }

      if (!inscripcion.puedeModificarse()) {
        return Result.failure('No se puede cancelar una inscripción en estado final');
      }

      inscripcion.cancelar(motivo);
      
      const inscripcionActualizada = await this.inscripcionRepository.save(inscripcion);

      // Publicar evento de dominio
      this.eventPublisher.emit(
        'inscripcion.rechazada',
        new InscripcionRechazadaEvent(inscripcionId, inscripcion.alumnoId, motivo)
      );

      return Result.success(inscripcionActualizada);
    } catch (error) {
      return Result.failure(`Error al cancelar inscripción: ${error.message}`);
    }
  }
}

// src/modules/academic/application/services/inscripcion.service.ts
import { Injectable } from '@nestjs/common';
import { CrearInscripcionUseCase } from '../use-cases/crear-inscripcion.use-case';
import { ListarInscripcionesUseCase } from '../use-cases/listar-inscripciones.use-case';
import { CancelarInscripcionUseCase } from '../use-cases/cancelar-inscripcion.use-case';
import { CrearInscripcionCommand } from '../commands/crear-inscripcion.command';
import { ListarInscripcionesQuery } from '../queries/listar-inscripciones.query';
import { Result } from 'src/shared/domain/result';

@Injectable()
export class InscripcionService {
  constructor(
    private readonly crearInscripcionUseCase: CrearInscripcionUseCase,
    private readonly listarInscripcionesUseCase: ListarInscripcionesUseCase,
    private readonly cancelarInscripcionUseCase: CancelarInscripcionUseCase
  ) {}

  async crearInscripcion(command: CrearInscripcionCommand): Promise<Result<any>> {
    return this.crearInscripcionUseCase.execute(command);
  }

  async listarInscripciones(query: ListarInscripcionesQuery): Promise<Result<any>> {
    return this.listarInscripcionesUseCase.execute(query);
  }

  async cancelarInscripcion(inscripcionId: number, motivo: string): Promise<Result<any>> {
    return this.cancelarInscripcionUseCase.execute(inscripcionId, motivo);
  }
}
