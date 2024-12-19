import getCurrentUser from "@/app/actions/getCurrentUser";
import {prisma} from "@/lib/prisma";

export default async function getArticleList() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return []
        const articles = await prisma.article.findMany({
            include: {
                createdBy: {select: {nickname: true, username: true}},
                _count: {select: {likes: true}},
                comments: true
            },
            orderBy: {createdAt: 'desc'},
        })
        return articles
    } catch (error: any) {
        throw new Error(error);
    }
}
