import { env } from '$env/dynamic/private';

// Estas variables solo están disponibles en el servidor
// Nunca se exponen al cliente por seguridad

export const databaseUrl = env('DATABASE_URL');
export const jwtSecret = env('JWT_SECRET');
export const jwtRefreshSecret = env('JWT_REFRESH_SECRET');
export const jwtExpiration = parseInt(env('JWT_EXPIRATION') || 3600; // 1 hora
export const jwtRefreshExpiration = parseInt(env('JWT_REFRESH_EXPIRATION') || 604800; // 7 días
