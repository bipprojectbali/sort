import { PrismaClient } from "generated/prisma";


// Gunakan globalThis untuk mencegah multiple instance saat hot reload
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient();

// Assign hanya di development, biar tidak leak di production
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
