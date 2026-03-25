# ========================================
# 4️⃣ PRESENTATION LAYER - Controllers y DTOs
# ========================================

// src/modules/academic/presentation/controllers/inscripcion.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Param, 
  Body, 
  Query, 
  HttpCode, 
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/presentation/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/presentation/guards/roles.guard';
import { Roles } from 'src/shared/presentation/decorators/roles.decorator';
import { InscripcionService } from '../../application/services/inscripcion.service';
import { CrearInscripcionDto } from '../../application/dto/crear-inscripcion.dto';
import { InscripcionResponseDto } from '../../application/dto/inscripcion-response.dto';
import { Result } from 'src/shared/domain/result';

@ApiTags('Inscripciones Académicas')
@Controller('inscripciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nueva inscripción académica' })
  @ApiResponse({ 
    status: 201, 
    description: 'Inscripción creada exitosamente',
    type: InscripcionResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos o validación fallida' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Inscripción duplicada o conflicto' 
  })
  @Roles('Administrativo', 'Secretaría', 'Alumno') // Alumno puede inscribirse a sí mismo
  async crearInscripcion(@Body() crearInscripcionDto: CrearInscripcionDto) {
    const command = {
      alumnoId: crearInscripcionDto.alumnoId,
      comisionId: crearInscripcionDto.comisionId,
      observaciones: crearInscripcionDto.observaciones
    };

    const result = await this.inscripcionService.crearInscripcion(command);

    if (!result.isSuccess) {
      // Determinar el código de error según el mensaje
      if (result.error.includes('Validación fallida')) {
        throw new BadRequestException(result.error);
      } else if (result.error.includes('ya tiene una inscripción activa')) {
        throw new ConflictException(result.error);
      } else {
        throw new InternalServerErrorException(result.error);
      }
    }

    const response = InscripcionResponseDto.fromEntity(result.value);
    
    return {
      success: true,
      message: 'Inscripción creada exitosamente',
      data: response
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar inscripciones con filtros' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de inscripciones obtenida exitosamente' 
  })
  @ApiQuery({ name: 'alumnoId', required: false, description: 'ID del alumno' })
  @ApiQuery({ name: 'comisionId', required: false, description: 'ID de la comisión' })
  @ApiQuery({ name: 'estado', required: false, description: 'Estado de la inscripción' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Registros por página', example: 20 })
  @Roles('Administrativo', 'Secretaría', 'Docente', 'Alumno')
  async listarInscripciones(
    @Query('alumnoId') alumnoId?: number,
    @Query('comisionId') comisionId?: number,
    @Query('estado') estado?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    const query = {
      alumnoId,
      comisionId,
      estado,
      page,
      limit
    };

    const result = await this.inscripcionService.listarInscripciones(query);

    if (!result.isSuccess) {
      throw new InternalServerErrorException(result.error);
    }

    return {
      success: true,
      message: 'Inscripciones obtenidas exitosamente',
      data: result.value.inscripciones,
      pagination: {
        page,
        limit,
        total: result.value.total,
        totalPages: Math.ceil(result.value.total / limit)
      }
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener inscripción por ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Inscripción encontrada exitosamente',
    type: InscripcionResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Inscripción no encontrada' 
  })
  @ApiParam({ name: 'id', description: 'ID de la inscripción' })
  @Roles('Administrativo', 'Secretaría', 'Docente', 'Alumno')
  async obtenerInscripcion(@Param('id') id: number) {
    // Usar el mismo servicio de listar pero filtrando por ID
    const result = await this.inscripcionService.listarInscripciones({
      page: 1,
      limit: 1
    });

    if (!result.isSuccess) {
      throw new InternalServerErrorException(result.error);
    }

    const inscripcion = result.value.inscripciones.find(i => i.id === id);
    
    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    return {
      success: true,
      message: 'Inscripción encontrada exitosamente',
      data: inscripcion
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar inscripción' })
  @ApiResponse({ 
    status: 200, 
    description: 'Inscripción cancelada exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Inscripción no encontrada' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'No se puede cancelar la inscripción' 
  })
  @ApiParam({ name: 'id', description: 'ID de la inscripción' })
  @Roles('Administrativo', 'Secretaría') // Solo roles autorizados pueden cancelar
  async cancelarInscripcion(
    @Param('id') id: number,
    @Body() body: { motivo: string }
  ) {
    if (!body.motivo || body.motivo.trim().length === 0) {
      throw new BadRequestException('El motivo de cancelación es obligatorio');
    }

    const result = await this.inscripcionService.cancelarInscripcion(id, body.motivo);

    if (!result.isSuccess) {
      if (result.error.includes('no encontrada')) {
        throw new NotFoundException(result.error);
      } else if (result.error.includes('No se puede cancelar')) {
        throw new BadRequestException(result.error);
      } else {
        throw new InternalServerErrorException(result.error);
      }
    }

    return {
      success: true,
      message: 'Inscripción cancelada exitosamente',
      data: InscripcionResponseDto.fromEntity(result.value)
    };
  }
}

// src/modules/academic/presentation/dto/inscripcion-params.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class InscripcionParamsDto {
  @ApiPropertyOptional({ description: 'ID del alumno' })
  @IsOptional()
  @IsNumber()
  alumnoId?: number;

  @ApiPropertyOptional({ description: 'ID de la comisión' })
  @IsOptional()
  @IsNumber()
  comisionId?: number;

  @ApiPropertyOptional({ 
    description: 'Estado de la inscripción',
    enum: ['Pendiente', 'Inscripto', 'Rechazada', 'Baja']
  })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ description: 'Número de página', minimum: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Registros por página', 
    minimum: 1, 
    maximum: 100, 
    default: 20 
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

// src/modules/academic/presentation/dto/cancelar-inscripcion.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelarInscripcionDto {
  @ApiProperty({ 
    description: 'Motivo de la cancelación',
    example: 'El alumno solicitó la baja por motivos personales'
  })
  @IsNotEmpty({ message: 'El motivo es obligatorio' })
  @IsString({ message: 'El motivo debe ser un texto' })
  motivo: string;
}

// src/modules/academic/presentation/interceptors/inscripcion.interceptor.ts
import { 
  Injectable, 
  NestInterceptor, 
  ExecutionContext, 
  CallHandler 
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InscripcionResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // Estandarizar formato de respuesta
        if (data && typeof data === 'object') {
          return {
            success: true,
            timestamp: new Date().toISOString(),
            path: context.switchToHttp().getRequest().url,
            ...data
          };
        }
        return data;
      })
    );
  }
}

// src/modules/academic/presentation/filters/inscripcion.exception.filter.ts
import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class InscripcionExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Error interno del servidor';
    let details: any = {};

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      message = (exceptionResponse as any).message || message;
      details = (exceptionResponse as any).details || {};
    }

    const errorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      details,
      statusCode: status
    };

    // Log del error para debugging
    console.error(`[${new Date().toISOString()}] ${request.method} ${request.url}`, {
      error: exception,
      response: errorResponse
    });

    response.status(status).json(errorResponse);
  }
}

// src/modules/academic/presentation/pipes/inscripcion-validation.pipe.ts
import { 
  PipeTransform, 
  Injectable, 
  ArgumentMetadata, 
  BadRequestException 
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class InscripcionValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = errors.map(error => {
        const constraints = Object.values(error.constraints || {});
        return constraints.join(', ');
      });

      throw new BadRequestException({
        message: 'Validación fallida',
        details: errorMessages
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
