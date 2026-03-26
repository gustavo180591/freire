import { PrismaClient } from '@prisma/client';

// Cliente de Prisma para el servidor
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});
