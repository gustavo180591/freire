-- Triggers y Constraints Adicionales para DATABASE_DESIGN.md
-- Instituto Superior de Formación Docente – Paulo Freire

-- ========================================
-- 1. Trigger para sincronizar campos denormalizados en Inscripcion
-- ========================================

CREATE OR REPLACE FUNCTION sincronizar_inscripcion_campos()
RETURNS TRIGGER AS $$
BEGIN
    -- Sincronizar materia_id y periodo_lectivo_id desde comision
    UPDATE inscripcion 
    SET 
        materia_id = c.materia_id,
        periodo_lectivo_id = c.periodo_lectivo_id
    FROM comision c
    WHERE inscripcion.id = NEW.id AND c.id = NEW.comision_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sincronizar_inscripcion_campos
    AFTER INSERT OR UPDATE ON inscripcion
    FOR EACH ROW
    EXECUTE FUNCTION sincronizar_inscripcion_campos();

-- ========================================
-- 2. Constraint CHECK para estado_financiero coherente
-- ========================================

ALTER TABLE alumno 
ADD CONSTRAINT chk_estado_financiero_coherente 
CHECK (
    (deuda_total = 0 AND estado_financiero = 'Al Día')
    OR
    (deuda_total > 0 AND estado_financiero = 'Con Deuda')
);

-- ========================================
-- 3. Trigger para validar inscripción en comisión antes de registrar asistencia
-- ========================================

CREATE OR REPLACE FUNCTION validar_asistencia_inscripcion()
RETURNS TRIGGER AS $$
DECLARE
    v_inscripcion_existe INTEGER;
BEGIN
    -- Verificar que alumno esté inscripto en comisión
    SELECT COUNT(*) INTO v_inscripcion_existe
    FROM inscripcion i
    WHERE i.alumno_id = NEW.alumno_id
      AND i.comision_id = NEW.comision_id
      AND i.estado = 'Inscripto';
    
    IF v_inscripcion_existe = 0 THEN
        RAISE EXCEPTION 'No puede registrarse asistencia: alumno no está inscripto en la comisión';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_asistencia_inscripcion
    BEFORE INSERT ON asistencia
    FOR EACH ROW
    EXECUTE FUNCTION validar_asistencia_inscripcion();

-- ========================================
-- 4. Trigger para actualizar inscripciones_count en MesaExamen
-- ========================================

CREATE OR REPLACE FUNCTION actualizar_inscripciones_mesa()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE mesa_examen 
        SET inscripciones_count = inscripciones_count + 1
        WHERE id = NEW.mesa_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE mesa_examen 
        SET inscripciones_count = inscripciones_count - 1
        WHERE id = OLD.mesa_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Si cambia el estado a Confirmada, incrementar
        IF OLD.estado != 'Confirmada' AND NEW.estado = 'Confirmada' THEN
            UPDATE mesa_examen 
            SET inscripciones_count = inscripciones_count + 1
            WHERE id = NEW.mesa_id;
        -- Si cambia de Confirmada a otro estado, decrementar
        ELSIF OLD.estado = 'Confirmada' AND NEW.estado != 'Confirmada' THEN
            UPDATE mesa_examen 
            SET inscripciones_count = inscripciones_count - 1
            WHERE id = NEW.mesa_id;
        END IF;
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_inscripciones_mesa
    AFTER INSERT OR UPDATE OR DELETE ON inscripcion_mesa
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_inscripciones_mesa();

-- ========================================
-- 5. Trigger para validar cupo en MesaExamen
-- ========================================

CREATE OR REPLACE FUNCTION validar_cupo_mesa()
RETURNS TRIGGER AS $$
DECLARE
    v_cupo_disponible INTEGER;
    v_inscripciones_actuales INTEGER;
BEGIN
    -- Obtener cupo disponible e inscripciones actuales
    SELECT cupo_maximo, inscripciones_count 
    INTO v_cupo_disponible, v_inscripciones_actuales
    FROM mesa_examen 
    WHERE id = NEW.mesa_id;
    
    -- Validar que haya cupo disponible
    IF v_inscripciones_actuales >= v_cupo_disponible THEN
        RAISE EXCEPTION 'No hay cupo disponible en la mesa de examen';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_cupo_mesa
    BEFORE INSERT ON inscripcion_mesa
    FOR EACH ROW
    EXECUTE FUNCTION validar_cupo_mesa();

-- ========================================
-- 6. Soft Delete para entidades críticas (mejora estratégica)
-- ========================================

-- Agregar deleted_at a entidades críticas
ALTER TABLE comision ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE materia ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE carrera ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE usuario ADD COLUMN deleted_at TIMESTAMP NULL;

-- Índices para soft delete
CREATE INDEX idx_comision_deleted_at ON comision(deleted_at);
CREATE INDEX idx_materia_deleted_at ON materia(deleted_at);
CREATE INDEX idx_carrera_deleted_at ON carrera(deleted_at);
CREATE INDEX idx_usuario_deleted_at ON usuario(deleted_at);

-- ========================================
-- 7. Event Store minimalista (mejora estratégica)
-- ========================================

CREATE TABLE event_store (
    id SERIAL PRIMARY KEY,
    aggregate_id VARCHAR(100) NOT NULL,
    aggregate_type VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    event_version INTEGER NOT NULL DEFAULT 1,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Índices para Event Store
CREATE INDEX idx_event_store_aggregate_id ON event_store(aggregate_id);
CREATE INDEX idx_event_store_aggregate_type ON event_store(aggregate_type);
CREATE INDEX idx_event_store_event_type ON event_store(event_type);
CREATE INDEX idx_event_store_occurred_at ON event_store(occurred_at);

-- ========================================
-- 8. Vista para consulta de deuda dinámica (alternativa a campo persistido)
-- ========================================

CREATE VIEW v_deuda_alumno AS
SELECT 
    a.id as alumno_id,
    a.nombre,
    a.deuda_total as deuda_persistida,
    COALESCE(SUM(cu.monto), 0) as cuotas_emitidas,
    COALESCE(SUM(p.monto), 0) as pagos_realizados,
    COALESCE(SUM(b.monto_fijo), 0) as becas_aplicadas,
    (COALESCE(SUM(cu.monto), 0) - COALESCE(SUM(p.monto), 0) - COALESCE(SUM(b.monto_fijo), 0)) as deuda_calculada
FROM alumno a
LEFT JOIN cuota cu ON cu.alumno_id = a.id
LEFT JOIN pago p ON p.alumno_id = a.id
LEFT JOIN beca b ON b.alumno_id = a.id AND b.estado = 'Activa'
GROUP BY a.id, a.nombre, a.deuda_total;

-- ========================================
-- 9. Función para recalcular deuda (mantenimiento)
-- ========================================

CREATE OR REPLACE FUNCTION recalcular_deuda_alumno(p_alumno_id INTEGER)
RETURNS VOID AS $$
DECLARE
    v_deuda_calculada DECIMAL(10,2);
BEGIN
    -- Calcular deuda dinámicamente
    SELECT COALESCE(SUM(cu.monto), 0) - COALESCE(SUM(p.monto), 0) - COALESCE(SUM(b.monto_fijo), 0)
    INTO v_deuda_calculada
    FROM alumno a
    LEFT JOIN cuota cu ON cu.alumno_id = a.id
    LEFT JOIN pago p ON p.alumno_id = a.id
    LEFT JOIN beca b ON b.alumno_id = a.id AND b.estado = 'Activa'
    WHERE a.id = p_alumno_id;
    
    -- Actualizar campo persistido (cache)
    UPDATE alumno 
    SET 
        deuda_total = COALESCE(v_deuda_calculada, 0),
        estado_financiero = CASE 
            WHEN COALESCE(v_deuda_calculada, 0) = 0 THEN 'Al Día'
            ELSE 'Con Deuda'
        END
    WHERE id = p_alumno_id;
    
    -- Registrar evento
    INSERT INTO event_store (
        aggregate_id, 
        aggregate_type, 
        event_type, 
        event_data
    ) VALUES (
        p_alumno_id::VARCHAR,
        'Alumno',
        'DeudaRecalculada',
        JSON_BUILD_OBJECT(
            'alumno_id', p_alumno_id,
            'deuda_anterior', (SELECT deuda_total FROM alumno WHERE id = p_alumno_id),
            'deuda_nueva', COALESCE(v_deuda_calculada, 0)
        )
    );
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 10. Índices adicionales para performance
-- ========================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_inscripcion_alumno_periodo ON inscripcion(alumno_id, periodo_lectivo_id);
CREATE INDEX idx_inscripcion_materia_periodo ON inscripcion(materia_id, periodo_lectivo_id);
CREATE INDEX idx_nota_alumno_materia ON nota(alumno_id, materia_id);
CREATE INDEX idx_pago_alumno_concepto_fecha ON pago(alumno_id, concepto, fecha);

-- Índices para consultas de estado
CREATE INDEX idx_alumno_completo ON alumno(estado_global, estado_financiero, carrera_id);
CREATE INDEX idx_comision_activa ON comision(periodo_lectivo_id) WHERE deleted_at IS NULL;

-- ========================================
-- Notas de Implementación
-- ========================================

/*
1. Los triggers mantienen consistencia automática de datos denormalizados
2. Los constraints CHECK garantizan coherencia entre campos relacionados
3. El Event Store permite auditoría y reconstrucción de estados
4. Soft Delete protege datos históricos institucionales
5. La vista v_deuda_alumno permite consulta dinámica sin impacto en performance
6. La función recalcular_deuda_alumno mantiene sincronización entre cálculo y cache
7. Los índices compuestos optimizan consultas críticas del sistema
8. Todos los triggers manejan errores con mensajes claros para debugging
*/
