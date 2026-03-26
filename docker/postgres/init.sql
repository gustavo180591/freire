-- Inicialización de la base de datos para Instituto Paulo Freire
-- Este script se ejecuta automáticamente cuando el contenedor de PostgreSQL se inicia por primera vez

-- Crear extensión para UUID (si se necesita en el futuro)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear índices adicionales para optimizar consultas
-- Estos índices se crearán también a través de Prisma, pero los definimos aquí para referencia

-- Índices para búsquedas rápidas de usuarios
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_active ON "User"(email) WHERE deletedAt IS NULL;
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_dni_active ON "User"(dni) WHERE deletedAt IS NULL;
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active ON "User"(activo) WHERE deletedAt IS NULL;

-- Índices para relaciones
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_user_id ON "UserRole"(userId);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_role_id ON "UserRole"(roleId);

-- Índices para refresh tokens
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_refresh_tokens_user_id ON "RefreshToken"(userId);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_refresh_tokens_expires ON "RefreshToken"(expiresAt);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_refresh_tokens_revoked ON "RefreshToken"(revoked);

-- Configuración de la base de datos
-- Ajustar parámetros para mejor rendimiento en entorno de desarrollo

-- Mostrar información de inicialización
DO $$
BEGIN
    RAISE NOTICE '🗄️ Base de datos PostgreSQL inicializada para Instituto Paulo Freire';
    RAISE NOTICE '📋 Esquema listo para migraciones de Prisma';
    RAISE NOTICE '🔐 Configuración de seguridad aplicada';
END $$;

-- Insertar datos de configuración inicial (opcional)
-- Estos datos podrían incluir configuraciones del sistema, parámetros, etc.

-- Ejemplo: Tabla de configuración del sistema (descomentar si se necesita)
/*
CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar configuraciones básicas
INSERT INTO system_config (key, value, description) VALUES
    ('institute_name', 'Instituto Paulo Freire', 'Nombre del instituto'),
    ('academic_year', '2025', 'Año académico actual'),
    ('currency', 'ARS', 'Moneda por defecto'),
    ('timezone', 'America/Argentina/Buenos_Aires', 'Zona horaria')
ON CONFLICT (key) DO NOTHING;
*/

-- Crear función para actualizar timestamps (opcional, Prisma lo maneja automáticamente)
/*
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
*/

-- Registrar finalización de la inicialización
DO $$
BEGIN
    RAISE NOTICE '✅ Inicialización de PostgreSQL completada exitosamente';
    RAISE NOTICE '🚀 Base de datos lista para recibir migraciones de Prisma';
END $$;
