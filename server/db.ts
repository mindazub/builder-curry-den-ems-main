import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Singleton pattern to ensure only one Prisma Client instance
export const prisma = global.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
