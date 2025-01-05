import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export default async function getMyArticleList() {
    const currentUser = await getCurrentUser()
    if (!currentUser) return []
    try {
        return await prisma.article.findMany({
            where: {
                createdById: currentUser.id
            },
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
