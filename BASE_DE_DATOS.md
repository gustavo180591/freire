# BASE_DE_DATOS.md
# Diseño de Base de Datos con Prisma
Instituto Superior de Formación Docente – Paulo Freire

**Stack**: PostgreSQL + Prisma ORM

## 1. Entidades Principales

### Usuario
- id
- nombre
- email
- password_hash
- rol_id
- activo
- created_at
- last_login

Soporta autenticación para todos los actores del sistema.

---

### Rol
- id
- nombre
- descripcion

---

### PeriodoLectivo
- id
- anio
- semestre (NULL para anual)
- descripcion
- fecha_inicio
- fecha_fin
- estado (Abierto / Cerrado)
- created_at
- updated_at

**Nota**: Entidad fundamental para control temporal de operaciones académicas.
**Regla de Dominio**: No puede haber superposición de fechas entre períodos activos.
**SQL**: CREATE FUNCTION validar_periodo_superpuesto() RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM periodo_lectivo 
               WHERE estado = 'Abierto' 
                 AND id != NEW.id 
                 AND ((fecha_inicio <= NEW.fecha_fin AND fecha_fin >= NEW.fecha_inicio)
                      OR (fecha_inicio <= NEW.fecha_inicio AND fecha_fin >= NEW.fecha_inicio))) THEN
        RAISE EXCEPTION 'Superposición de fechas con período lectivo activo existente';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

---

### Beca
- id
- alumno_id
- tipo (Porcentaje / Fijo)
- porcentaje (NULL si fijo)
- monto_fijo (NULL si porcentual)
- motivo
- fecha_desde
- fecha_hasta
- estado (Activa / Vencida / Cancelada)
- concedida_por
- created_at
- updated_at

**Nota**: Becas como atributos financieros, no como estados. Solo una entidad Beca definida.

---

### ExcepcionAcademica
- id
- alumno_id
- tipo (Inscripción / Regularidad / Evaluación / etc.)
- motivo
- detalles (JSONB)
- aprobada_por
- fecha_solicitud
- fecha_aprobacion
- vigencia
- estado (Pendiente / Aprobada / Rechazada / Vencida)
- created_at
- updated_at

**Nota**: Registro formal de excepciones autorizadas con auditoría completa.

---

### ConfiguracionSistema
- id
- clave
- valor
- descripcion
- editable
- updated_at
- created_at

**Nota**: Parámetros configurables del sistema para evitar hardcode.

---

### RegularidadCursada
- id
- alumno_id
- comision_id
- periodo_lectivo_id
- estado (Regular / Libre / Pendiente / Abandonada)
- porcentaje_asistencia
- fecha_calculo
- created_at
- updated_at

**Nota**: Reemplaza estado global de regularidad. Manejada por cursada/materia.
**Constraint**: UNIQUE(alumno_id, comision_id, periodo_lectivo_id)
**SQL**: ALTER TABLE regularidad_cursada ADD CONSTRAINT uq_regularidad UNIQUE(alumno_id, comision_id, periodo_lectivo_id);

---

### Alumno
- id
- usuario_id
- nombre
- apellido
- dni
- email
- telefono
- fecha_nacimiento
- carrera_id
- **estado_global** (Activo / Suspendido / Baja / Egresado / Inactivo)
- estado_financiero (Al Día / Con Deuda)
- **deuda_total** (campo persistido actualizado por eventos financieros - NO es fuente de verdad, se recalcula ante cada evento financiero. Se actualiza mediante eventos financieros (PagoRegistrado, BecaAplicada, etc.) y se valida contra cálculo real en procesos críticos. **Política de implementación**: Columna persistida con actualización por eventos de dominio, validación en procesos críticos de cierre de acta y generación de reportes financieros.)
- fecha_ultimo_cambio_estado
- created_at
- updated_at
- deleted_at

**Nota**: `porcentaje_asistencia_actual` eliminado. La regularidad se maneja por cursada en `regularidad_cursada`.

Incluye campos para validaciones automáticas de regularidad y estado financiero.

---

### Docente
- id
- usuario_id

---

### Carrera
- id
- nombre
- duracion_anios
- activa

---

### Materia
- id
- carrera_id
- nombre
- anio
- porcentaje_regularidad_minimo
- cupo_maximo_inscripcion
- activa
- created_at
- updated_at

Agregado porcentaje mínimo para cálculo automático de regularidad.

---

### Correlatividad
- id
- materia_id
- materia_requisito_id
- tipo (Previa / Simultanea)
- created_at

**Constraint**: CHECK(materia_id != materia_requisito_id) - Evita autorreferencia absurda.
**SQL**: ALTER TABLE correlatividad ADD CONSTRAINT chk_correlatividad_no_autoreferencia CHECK(materia_id != materia_requisito_id);

---

### Comision
- id
- materia_id
- docente_id
- **periodo_lectivo_id**
- anio_lectivo
- cupo_maximo
- version INTEGER NOT NULL DEFAULT 0  -- Optimistic locking para control de cupo
- created_at
- updated_at

**Nota**: Agregada relación con PeriodoLectivo para control temporal.

---

### Inscripcion
- id
- alumno_id
- comision_id
- **materia_id** (denormalizado controlado para INV-DUP-01)
- **periodo_lectivo_id** (denormalizado controlado para INV-DUP-01)
- **estado** (Pendiente / Inscripto / Rechazada / Baja)
- fecha_inscripcion
- intentos_bloqueados (contador)
- observaciones
- created_at
- updated_at

**Nota**: Estados alineados con DOMAIN_MODEL. Aprobación/Reprobación manejada en notas y regularidad_cursada.
**Nota**: materia_id y periodo_lectivo_id son denormalizados controlados para cumplir INV-DUP-01 exactamente.
**Constraint**: UNIQUE(alumno_id, materia_id, periodo_lectivo_id) - Cumple INV-DUP-01 exactamente
**Trigger**: Sincronizar materia_id y periodo_lectivo_id desde comision_id para mantener consistencia.

Incluye tracking de intentos bloqueados para auditoría.

---

### Nota
- id
- alumno_id
- **mesa_id** (para notas finales)
- comision_id (para notas parciales)
- calificacion
- tipo (Parcial / Final / Recuperatorio)
- fecha_carga
- docente_id
- created_at
- updated_at

**Nota**: Notas finales ligadas a mesa_id específica, no solo a materia_id.

Incluye auditoría de cambios en notas.

**Constraint**: CHECK (calificacion BETWEEN 0 AND 10),  -- INV-NOT-01: Nota en rango válido
**Constraint**: CHECK (
        (tipo = 'Final' AND mesa_id IS NOT NULL AND comision_id IS NULL)
        OR
        (tipo != 'Final' AND comision_id IS NOT NULL AND mesa_id IS NULL)
    )  -- Constraint para consistencia de tipo de nota

---

### Asistencia
- id
- alumno_id
- comision_id
- fecha
- presente (boolean)

**Nota**: Control de duplicación por día y comisión.
**Constraint**: UNIQUE(alumno_id, comision_id, fecha) - Cumple INV-ASI-01 exactamente
**Trigger**: Validar que alumno esté inscripto en comisión antes de registrar asistencia.

---

### MesaExamen
- id
- materia_id
- fecha
- **estado** (Programada / Inscripción Abierta / Inscripción Cerrada / En Curso / Cerrada / Acta Generada / Anulada / Reprogramada)
- presidente_mesa_id
- vocal1_id
- vocal2_id
- **cupo_maximo** (control de inscripciones)
- **inscripciones_count** (contador para performance)
- version INTEGER NOT NULL DEFAULT 0  -- Optimistic locking para control de concurrencia en inscripción a mesa
- created_at
- updated_at

**Nota**: Eliminado campo redundante acta_generada (estado Acta Generada es suficiente).
**Nota**: cupo_maximo e inscripciones_count replican patrón de Comisión para control de cupo.

Soporta generación de actas oficiales y control de cupo en tiempo real.

---

### Acta
- id
- mesa_id
- **estado** (Borrador / Revisión / Generada / Cerrada / Rectificada / Rechazada / Anulada)
- fecha_cierre
- firmada_por
- version INTEGER NOT NULL DEFAULT 0  -- Optimistic locking para control de concurrencia en cierre y rectificación
- created_at
- updated_at

**Nota**: Estado completo en lugar de boolean, alineado con DOMAIN_MODEL.

---

### ReciboDocente
- id
- docente_id
- periodo VARCHAR(20)  -- Ej: "2024-1", "2024-2"
- archivo_path VARCHAR(500)
- nombre_archivo VARCHAR(200)
- estado VARCHAR(20) DEFAULT 'Activo'  -- Activo / Anulado
- subido_por INTEGER REFERENCES usuario(id)
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

**Nota**: Entidad ligera para gestión documental de recibos de sueldo.
**Constraint**: UNIQUE(docente_id, periodo) - Evita duplicados por docente y período.

---

### Pago
- id
- alumno_id
- monto
- fecha
- concepto
- tipo (Matrícula / Cuota / Extra)
- created_at
- updated_at

Incluye detalle para mejor control financiero.

---

### InscripcionMesa
- id
- alumno_id
- mesa_id
- estado (Pendiente / Confirmada / Ausente / Rechazada)
- created_at
- updated_at

**Nota**: Modela inscripción a mesas de examen para control de cupo e historial completo.
**Constraint**: UNIQUE(alumno_id, mesa_id) - Evita doble inscripción a misma mesa.
**SQL**: ALTER TABLE inscripcion_mesa ADD CONSTRAINT uq_inscripcion_mesa UNIQUE(alumno_id, mesa_id);

---

### Auditoria
- id
- usuario_id
- accion
- entidad
- entidad_id
- fecha
- descripcion
- ip_address
- user_agent
- datos_anteriores
- created_at

**Nota**: Registro completo de todas las operaciones críticas del sistema.

---

### EstadoAlumnoHistorial
- id
- alumno_id
- estado_anterior
- estado_nuevo
- motivo
- fecha_cambio
- cambiado_por
- observaciones

Registra todos los cambios de estado académico para trazabilidad institucional.

---

### Permiso
- id
- nombre
- descripcion
- modulo
- accion

Define permisos granulares para control de acceso fino.

---

### RolPermiso
- id
- rol_id
- permiso_id
- concedido_por
- fecha_asignacion

Asocia permisos específicos a roles para control granular.

---

## 2. Reglas de Integridad

### Invariantes de Inscripción (INV-INS)
- **INV-INS-01**: No puede existir inscripción confirmada si alumno no está `Activo`
- **INV-INS-02**: No puede existir inscripción confirmada si `deuda_total > 0`
- **INV-INS-03**: No puede existir inscripción confirmada si no cumple correlatividades
- **INV-INS-04**: No puede existir inscripción confirmada si comisión no tiene cupo
- **INV-INS-05**: No puede existir inscripción confirmada si hay conflicto de horario
- **INV-INS-06**: No puede existir inscripción confirmada si alumno está `Suspendido` o `Baja`
- **INV-INS-07**: No puede existir más de una inscripción activa a misma materia en mismo período lectivo

### Invariantes de Período Lectivo (INV-PER)
- **INV-PER-01**: No puede existir inscripción fuera de período lectivo válido
- **INV-PER-02**: No puede registrarse asistencia fuera del período lectivo activo
- **INV-PER-03**: No puede cerrarse período lectivo con inscripciones pendientes
- **INV-PER-04**: No puede haber más de un período lectivo activo simultáneamente

### Invariantes de Duplicidad (INV-DUP)
- **INV-DUP-01**: No puede existir más de una inscripción activa a misma materia en mismo período lectivo
- **INV-DUP-02**: No puede existir más de una regularidad activa para mismo alumno y comisión
- **INV-DUP-03**: No puede existir más de un estado financiero activo para mismo alumno
- **INV-DUP-04**: No puede existir más de una beca activa del mismo tipo para mismo alumno

### Invariantes de Estado Global (INV-EST)
- **INV-EST-01**: Todo alumno debe tener exactamente un estado global activo
- **INV-EST-02**: No puede pasar de `Egresado` a cualquier otro estado excepto `Inactivo`
- **INV-EST-03**: Todo cambio de estado debe quedar registrado en `estado_alumno_historial`
- **INV-EST-04**: No puede haber dos estados `Activo` simultáneos para mismo alumno

### Invariantes de Notas y Actas (INV-NOT/ACT)
- **INV-NOT-01**: Una nota final debe estar asociada a mesa de examen válida
- **INV-NOT-02**: Una nota final debe estar en rango [0, 10]
- **INV-NOT-03**: No puede cargarse nota si docente no está asignado a comisión/mesa
- **INV-NOT-04**: Si tipo = Final → mesa_id NOT NULL, comision_id NULL
- **INV-NOT-05**: Si tipo != Final → comision_id NOT NULL, mesa_id NULL
- **INV-ACT-01**: No puede cerrarse acta si faltan notas finales de alumnos inscriptos
- **INV-ACT-02**: No puede modificarse acta en estado `Cerrada` sin permisos especiales
- **INV-ACT-03**: Una acta solo puede cerrarse si todos los datos son consistentes

### Invariantes Financieros (INV-FIN)
- **INV-FIN-01**: No puede existir pago con monto negativo
- **INV-FIN-02**: La deuda total debe ser siempre >= 0
- **INV-FIN-03**: No puede aplicarse beca si alumno no está `Activo`
- **INV-FIN-04**: Los bloqueos académicos por deuda deben ser automáticos y reversibles
- **INV-FIN-05**: El campo estado_financiero debe reflejar coherentemente el valor calculado de deuda_total
- **INV-FIN-06**: estado_financiero es proyección derivada, no fuente de verdad (la fuente es cálculo dinámico)

### Invariantes de Asistencia y Regularidad (INV-ASI/REG)
- **INV-ASI-01**: No puede registrarse asistencia en comisión si alumno no está inscripto
- **INV-ASI-02**: El porcentaje de asistencia debe calcularse sobre total de clases dictadas
- **INV-ASI-03**: No puede registrarse asistencia en fechas futuras
- **INV-REG-01**: El cambio de estado Regular/Libre debe dispararse automáticamente
- **INV-REG-02**: Un alumno no puede estar Regular y Libre en misma cursada simultáneamente

**Estos invariantes son LEYES del sistema. Cualquier violación debe ser considerada bug crítico.**

---

## 3. Índices Críticos de Performance

### Índices Principales

```sql
-- Índices para consultas frecuentes de alumnos
CREATE INDEX idx_alumno_usuario_id ON alumno(usuario_id);
CREATE INDEX idx_alumno_carrera_id ON alumno(carrera_id);
CREATE INDEX idx_alumno_estado_global ON alumno(estado_global);
CREATE INDEX idx_alumno_estado_financiero ON alumno(estado_financiero);

-- Índices para inscripciones (con UNIQUE constraint corregido)
CREATE UNIQUE INDEX idx_inscripcion_alumno_materia_periodo ON inscripcion(alumno_id, materia_id, periodo_lectivo_id);
CREATE INDEX idx_inscripcion_alumno_id ON inscripcion(alumno_id);
CREATE INDEX idx_inscripcion_comision_id ON inscripcion(comision_id);
CREATE INDEX idx_inscripcion_materia_id ON inscripcion(materia_id);
CREATE INDEX idx_inscripcion_periodo_id ON inscripcion(periodo_lectivo_id);
CREATE INDEX idx_inscripcion_estado ON inscripcion(estado);
CREATE INDEX idx_inscripcion_fecha ON inscripcion(fecha_inscripcion);

-- Índices para regularidad por cursada (con UNIQUE constraint)
CREATE UNIQUE INDEX idx_regularidad_alumno_comision_periodo ON regularidad_cursada(alumno_id, comision_id, periodo_lectivo_id);
CREATE INDEX idx_regularidad_alumno_id ON regularidad_cursada(alumno_id);
CREATE INDEX idx_regularidad_comision_id ON regularidad_cursada(comision_id);
CREATE INDEX idx_regularidad_periodo_id ON regularidad_cursada(periodo_lectivo_id);
CREATE INDEX idx_regularidad_estado ON regularidad_cursada(estado);

-- Índices para notas
CREATE INDEX idx_nota_alumno_id ON nota(alumno_id);
CREATE INDEX idx_nota_mesa_id ON nota(mesa_id);
CREATE INDEX idx_nota_comision_id ON nota(comision_id);
CREATE INDEX idx_nota_tipo ON nota(tipo);

-- Índices UNIQUE críticos para datos institucionales
CREATE UNIQUE INDEX idx_usuario_email ON usuario(email);
CREATE UNIQUE INDEX idx_alumno_dni ON alumno(dni);

-- Índices para período lectivo
CREATE UNIQUE INDEX idx_periodo_activo_unico 
ON periodo_lectivo(estado)
WHERE estado = 'Abierto';  -- Constraint fuerte para único período activo
CREATE INDEX idx_periodo_lectivo_anio ON periodo_lectivo(anio);

-- Índice para comisiones por período
CREATE INDEX idx_comision_periodo ON comision(periodo_lectivo_id);

-- Índices para becas
CREATE INDEX idx_beca_alumno_id ON beca(alumno_id);
CREATE INDEX idx_beca_estado ON beca(estado);
CREATE INDEX idx_beca_tipo ON beca(tipo);

-- Índices para recibos de docentes
CREATE INDEX idx_recibo_docente_docente_id ON recibo_docente(docente_id);
CREATE UNIQUE INDEX idx_recibo_docente_periodo ON recibo_docente(docente_id, periodo);

-- Índices para excepciones académicas
CREATE INDEX idx_excepcion_alumno_id ON excepcion_academica(alumno_id);
CREATE INDEX idx_excepcion_estado ON excepcion_academica(estado);
CREATE INDEX idx_excepcion_tipo ON excepcion_academica(tipo);

-- Índices para configuración del sistema
CREATE UNIQUE INDEX idx_configuracion_clave ON configuracion_sistema(clave);
CREATE INDEX idx_configuracion_editable ON configuracion_sistema(editable);
```

-- Índices para asistencia (con UNIQUE constraint)
CREATE UNIQUE INDEX idx_asistencia_alumno_comision_fecha ON asistencia(alumno_id, comision_id, fecha);
CREATE INDEX idx_asistencia_alumno_id ON asistencia(alumno_id);
CREATE INDEX idx_asistencia_comision_id ON asistencia(comision_id);
CREATE INDEX idx_asistencia_fecha ON asistencia(fecha);

-- Índices para inscripciones a mesa (con control de cupo)
CREATE INDEX idx_inscripcion_mesa_alumno ON inscripcion_mesa(alumno_id);
CREATE INDEX idx_inscripcion_mesa_mesa ON inscripcion_mesa(mesa_id);
CREATE INDEX idx_inscripcion_mesa_estado ON inscripcion_mesa(estado);
CREATE INDEX idx_inscripcion_mesa_cupo ON inscripcion_mesa(mesa_id) WHERE estado = 'Confirmada'; -- Para control rápido de cupo

-- Índices para pagos
CREATE INDEX idx_pago_alumno_id ON pago(alumno_id);
CREATE INDEX idx_pago_alumno_fecha ON pago(alumno_id, fecha);
CREATE INDEX idx_pago_concepto ON pago(concepto);

-- Índices para auditoría
CREATE INDEX idx_auditoria_usuario_id ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_entidad ON auditoria(entidad);
CREATE INDEX idx_auditoria_fecha ON auditoria(fecha);
CREATE INDEX idx_auditoria_entidad_id ON auditoria(entidad, entidad_id);

-- Índices para historial de estados
CREATE INDEX idx_estado_historial_fecha ON estado_alumno_historial(fecha_cambio);

---

## 4. Relaciones Principales (Foreign Keys)

### Relaciones de Negocio Críticas
- `alumno.usuario_id` → `usuario.id`
- `alumno.carrera_id` → `carrera.id`
- `comision.materia_id` → `materia.id`
- `comision.docente_id` → `docente.id`
- `comision.periodo_lectivo_id` → `periodo_lectivo.id`
- `inscripcion.alumno_id` → `alumno.id`
- `inscripcion.comision_id` → `comision.id`
- `regularidad_cursada.alumno_id` → `alumno.id`
- `regularidad_cursada.comision_id` → `comision.id`
- `regularidad_cursada.periodo_lectivo_id` → `periodo_lectivo.id`
- `nota.alumno_id` → `alumno.id`
- `nota.mesa_id` → `mesa_examen.id`
- `nota.comision_id` → `comision.id`
- `mesa_examen.materia_id` → `materia.id`
- `mesa_examen.presidente_mesa_id` → `docente.id`
- `mesa_examen.vocal1_id` → `docente.id`
- `mesa_examen.vocal2_id` → `docente.id`
- `acta.mesa_id` → `mesa_examen.id`
- `beca.alumno_id` → `alumno.id`
- `recibo_docente.docente_id` → `docente.id`
- `recibo_docente.subido_por` → `usuario.id`
- `asistencia.alumno_id` → `alumno.id`
- `asistencia.comision_id` → `comision.id`
- `excepcion_academica.alumno_id` → `alumno.id`
- `inscripcion_mesa.alumno_id` → `alumno.id`
- `inscripcion_mesa.mesa_id` → `mesa_examen.id`

Nota: Todas las relaciones tienen integridad referencial (ON DELETE RESTRICT por defecto).

---

## 5. Estrategia de Particionamiento

```sql
-- Particionar tabla de auditoría por año para mejor rendimiento
CREATE TABLE auditoria_2024 PARTITION OF auditoria
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE auditoria_2025 PARTITION OF auditoria
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Particionar tabla de asistencia por año lectivo
CREATE TABLE asistencia_2024 PARTITION OF asistencia
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```