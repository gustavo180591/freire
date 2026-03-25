# ========================================
# 3️⃣ INFRASTRUCTURE LAYER - Implementación Técnica
# ========================================

// src/modules/academic/infrastructure/entities/inscripcion.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Alumno } from './alumno.entity';
import { Comision } from './comision.entity';

@Entity('inscripcion')
export class InscripcionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'alumno_id' })
  alumnoId: number;

  @Column({ name: 'comision_id' })
  comisionId: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'Pendiente'
  })
  estado: string;

  @CreateDateColumn({ name: 'fecha_inscripcion' })
  fechaInscripcion: Date;

  @Column({ name: 'intentos_bloqueados', default: 0 })
  intentosBloqueados: number;

  @Column({ name: 'observaciones', nullable: true, type: 'text' })
  observaciones?: string;

  // Relaciones
  @ManyToOne(() => Alumno, { lazy: true })
  @JoinColumn({ name: 'alumno_id' })
  alumno: Promise<Alumno>;

  @ManyToOne(() => Comision, { lazy: true })
  @JoinColumn({ name: 'comision_id' })
  comision: Promise<Comision>;

  // Campos denormalizados para performance
  @Column({ name: 'materia_id', nullable: true })
  materiaId?: number;

  @Column({ name: 'periodo_lectivo_id', nullable: true })
  periodoLectivoId?: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

// src/modules/academic/infrastructure/repositories/inscripcion.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InscripcionEntity } from '../entities/inscripcion.entity';
import { Inscripcion } from '../../domain/entities/inscripcion.entity';
import { EstadoInscripcion } from '../../domain/entities/inscripcion.entity';
import { IInscripcionRepository } from '../../domain/repositories/inscripcion.repository.interface';
import { ListarInscripcionesQuery } from '../../application/queries/listar-inscripciones.query';

@Injectable()
export class InscripcionRepository implements IInscripcionRepository {
  constructor(
    @InjectRepository(InscripcionEntity)
    private readonly repository: Repository<InscripcionEntity>
  ) {}

  async save(inscripcion: Inscripcion): Promise<Inscripcion> {
    const entity = this.toEntity(inscripcion);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: number): Promise<Inscripcion | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByAlumnoYComision(alumnoId: number, comisionId: number): Promise<Inscripcion | null> {
    const entity = await this.repository.findOne({
      where: { alumnoId, comisionId }
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAllWithFilters(query: ListarInscripcionesQuery): Promise<{ inscripciones: Inscripcion[], total: number }> {
    const queryBuilder = this.repository.createQueryBuilder('inscripcion');

    // Filtros
    if (query.alumnoId) {
      queryBuilder.andWhere('inscripcion.alumnoId = :alumnoId', { alumnoId: query.alumnoId });
    }

    if (query.comisionId) {
      queryBuilder.andWhere('inscripcion.comisionId = :comisionId', { comisionId: query.comisionId });
    }

    if (query.estado) {
      queryBuilder.andWhere('inscripcion.estado = :estado', { estado: query.estado });
    }

    // Ordenamiento
    queryBuilder.orderBy('inscripcion.fechaInscripcion', 'DESC');

    // Paginación
    const offset = (query.page - 1) * query.limit;
    queryBuilder.skip(offset).take(query.limit);

    // Ejecutar query con total
    const [entities, total] = await queryBuilder.getManyAndCount();

    const inscripciones = entities.map(entity => this.toDomain(entity));

    return { inscripciones, total };
  }

  async findByAlumno(alumnoId: number): Promise<Inscripcion[]> {
    const entities = await this.repository.find({
      where: { alumnoId },
      order: { fechaInscripcion: 'DESC' }
    });

    return entities.map(entity => this.toDomain(entity));
  }

  async findByComision(comisionId: number): Promise<Inscripcion[]> {
    const entities = await this.repository.find({
      where: { comisionId },
      order: { fechaInscripcion: 'ASC' }
    });

    return entities.map(entity => this.toDomain(entity));
  }

  async countByComision(comisionId: number): Promise<number> {
    return await this.repository.count({
      where: { comisionId, estado: 'Inscripto' }
    });
  }

  // Métodos privados de mapeo
  private toEntity(inscripcion: Inscripcion): Partial<InscripcionEntity> {
    return {
      id: inscripcion.id,
      alumnoId: inscripcion.alumnoId,
      comisionId: inscripcion.comisionId,
      estado: inscripcion.estado,
      fechaInscripcion: inscripcion.fechaInscripcion,
      intentosBloqueados: inscripcion.intentosBloqueados
    };
  }

  private toDomain(entity: InscripcionEntity): Inscripcion {
    return new Inscripcion(
      entity.id,
      entity.alumnoId,
      entity.comisionId,
      entity.estado as EstadoInscripcion,
      entity.fechaInscripcion,
      entity.intentosBloqueados
    );
  }
}

// src/modules/academic/infrastructure/repositories/alumno.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlumnoEntity } from '../entities/alumno.entity';
import { IAlumnoRepository } from '../../domain/repositories/alumno.repository.interface';

@Injectable()
export class AlumnoRepository implements IAlumnoRepository {
  constructor(
    @InjectRepository(AlumnoEntity)
    private readonly repository: Repository<AlumnoEntity>
  ) {}

  async findById(id: number): Promise<any> {
    return await this.repository.findOne({ 
      where: { id },
      relations: ['usuario', 'carrera']
    });
  }

  async materiaAprobada(alumnoId: number, materiaId: number): Promise<boolean> {
    // Query para verificar si el alumno aprobó la materia
    const result = await this.repository.query(`
      SELECT COUNT(*) > 0 as aprobada
      FROM inscripcion i
      JOIN nota n ON n.alumno_id = i.alumno_id AND n.comision_id = i.comision_id
      WHERE i.alumno_id = $1 
        AND i.comision_id IN (
          SELECT id FROM comision WHERE materia_id = $2
        )
        AND n.calificacion >= 6
        AND i.estado = 'Inscripto'
    `, [alumnoId, materiaId]);

    return result[0]?.aprobada || false;
  }
}

// src/modules/academic/infrastructure/event-handlers/inscripcion.event-handler.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InscripcionCreadaEvent } from '../../domain/events/inscripcion.events';
import { ComisionRepository } from '../repositories/comision.repository';
import { AuditoriaService } from 'src/shared/infrastructure/services/auditoria.service';
import { NotificationService } from 'src/shared/infrastructure/services/notification.service';

@Injectable()
export class InscripcionEventHandler {
  constructor(
    private readonly comisionRepository: ComisionRepository,
    private readonly auditoriaService: AuditoriaService,
    private readonly notificationService: NotificationService
  ) {}

  @OnEvent('inscripcion.creada')
  async handleInscripcionCreada(event: InscripcionCreadaEvent) {
    console.log(`Inscripción creada: ${event.inscripcionId}`);

    // Actualizar contador de inscripciones en comisión
    await this.comisionRepository.incrementarInscripciones(event.comisionId);

    // Registrar auditoría
    await this.auditoriaService.registrarAccion({
      entidad: 'inscripcion',
      entidadId: event.inscripcionId,
      accion: 'CREAR',
      detalles: `Inscripción creada para alumno ${event.alumnoId} en comisión ${event.comisionId}`
    });

    // Enviar notificación (asíncrono)
    await this.notificationService.notificarInscripcionCreada(event.alumnoId, event.comisionId);
  }

  @OnEvent('inscripcion.rechazada')
  async handleInscripcionRechazada(event: any) {
    console.log(`Inscripción rechazada: ${event.inscripcionId}`);

    // Registrar auditoría
    await this.auditoriaService.registrarAccion({
      entidad: 'inscripcion',
      entidadId: event.inscripcionId,
      accion: 'RECHAZAR',
      detalles: `Inscripción rechazada: ${event.motivo}`
    });
  }
}

// src/modules/academic/infrastructure/config/inscripcion.module.config.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscripcionEntity } from '../entities/inscripcion.entity';
import { AlumnoEntity } from '../entities/alumno.entity';
import { ComisionEntity } from '../entities/comision.entity';

export const InscripcionInfrastructureConfig = TypeOrmModule.forFeature([
  InscripcionEntity,
  AlumnoEntity,
  ComisionEntity
]);
