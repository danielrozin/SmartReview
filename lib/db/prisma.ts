import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { _prisma: PrismaClient | undefined };

function createClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    return {} as PrismaClient;
  }
  return new PrismaClient();
}

export const prisma = globalForPrisma._prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma._prisma = prisma;
