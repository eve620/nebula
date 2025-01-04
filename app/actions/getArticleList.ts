import {prisma} from "@/lib/prisma";

export default async function getArticleList() {
    try {
        return await prisma.article.findMany({
            include: {
                createdBy: {select: {id: true, nickname: true, username: true}},
                _count: {select: {likes: true, comments: true}},
            },
            orderBy: {createdAt: 'desc'},
        })
    } catch {
        throw new Error();
    }
}
