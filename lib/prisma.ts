import {PrismaClient} from '@prisma/client'

// 确保在热重载时不会重复创建 Prisma Client
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient()
prisma.$use(async (params, next) => {
    if (params.model === 'Comment' && params.action === 'findMany') {
        const result = await next(params)

        await prisma.comment.updateMany({
            where: {id: {in: result.map((item) => item.id)}},
            data: {isRead: true},
        })

        return result
    }
    if (params.model === 'ChildComment' && params.action === 'findMany') {
        const result = await next(params)

        await prisma.childComment.updateMany({
            where: {id: {in: result.map((item) => item.id)}},
            data: {isRead: true},
        })

        return result
    }
    if (params.model === 'Like' && params.action === 'findMany') {
        const result = await next(params)

        await prisma.like.updateMany({
            where: {id: {in: result.map((item) => item.id)}},
            data: {isRead: true},
        })

        return result
    }
    return next(params)
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
