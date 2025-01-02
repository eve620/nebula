import {NextResponse} from 'next/server'
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: Request) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    const {searchParams} = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
        return NextResponse.json({error: 'UserId is required'}, {status: 400})
    }

    try {
        const likes = await prisma.like.findMany({
            where: {userId},
            select: {articleId: true},
        })

        return NextResponse.json(likes)
    } catch (error) {
        console.error('Error fetching likes:', error)
        return NextResponse.json({message: 'Failed to fetch likes'}, {status: 500})
    }
}

export async function POST(request: Request) {
    const {createdById, articleId, commentId} = await request.json()

    if (!articleId && !commentId) {
        return NextResponse.json({error: 'Either articleId or commentId is required'}, {status: 400})
    }
    // 查找是否已经存在点赞记录
    const existingLike = await prisma.like.findFirst({
        where: {
            createdById,
            OR: [
                {articleId: articleId ?? undefined},
                {commentId: commentId ?? undefined}
            ]
        }
    })

    if (existingLike) {
        // 取消点赞
        await prisma.like.delete({
            where: {
                id: existingLike.id
            }
        })
        return NextResponse.json({message: 'Like removed successfully'}, {status: 200})
    } else {
        const article = await prisma.article.findFirst({
            where: {
                id: articleId
            }
        })
        // 点赞
        const like = await prisma.like.create({
            data: {
                createdById,
                articleId,
                commentId,
                articleById: article.createdById
            }
        })
        return NextResponse.json(like, {status: 201})
    }

}
