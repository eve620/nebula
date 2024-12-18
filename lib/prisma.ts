import { PrismaClient } from '@prisma/client'

// 确保在热重载时不会重复创建 Prisma Client
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
