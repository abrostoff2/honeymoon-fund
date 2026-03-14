import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL || "file:./prisma/dev.db";

  // Use libSQL adapter for Turso (libsql:// URLs), local SQLite otherwise
  const adapter = url.startsWith("libsql://")
    ? new PrismaLibSql({ url, authToken: process.env.TURSO_AUTH_TOKEN })
    : new PrismaBetterSqlite3({ url });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
