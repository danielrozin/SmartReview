import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  _prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    return {} as PrismaClient;
  }
  const adapter = new PrismaPg(process.env.DATABASE_URL);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma._prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma._prisma = prisma;
