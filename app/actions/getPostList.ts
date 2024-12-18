import getCurrentUser from "@/app/actions/getCurrentUser";
import {prisma} from "@/lib/prisma";

export default async function getPostList() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return []
        const posts = await prisma.post.findMany({
            include: {
                createdBy: {select: {nickname: true, username: true}},
                _count: {select: {likes: true}},
                comments: true
            },
            orderBy: {createdAt: 'desc'},
        })
        return posts
    } catch (error: any) {
        throw new Error(error);
    }
}
