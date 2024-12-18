import {NextResponse} from 'next/server'
import {prisma} from "@/lib/prisma";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
        return NextResponse.json({error: 'UserId is required'}, {status: 400})
    }

    try {
        const likes = await prisma.like.findMany({
            where: {userId},
            select: {postId: true},
        })

        return NextResponse.json(likes)
    } catch (error) {
        console.error('Error fetching likes:', error)
        return NextResponse.json({message: 'Failed to fetch likes'}, {status: 500})
    }
}

export async function POST(request: Request) {
    const body = await request.json()
    const {userId, postId, commentId} = body

    if (!postId && !commentId) {
        return NextResponse.json({error: 'Either postId or commentId is required'}, {status: 400})
    }

    // 查找是否已经存在点赞记录
    const existingLike = await prisma.like.findFirst({
        where: {
            userId,
            OR: [
                {postId: postId ?? undefined},
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
        // 点赞
        const like = await prisma.like.create({
            data: {
                userId,
                postId,
                commentId
            }
        })
        return NextResponse.json(like, {status: 201})
    }

}

export async function DELETE(request: Request) {
    const {searchParams} = new URL(request.url)
    const userId = searchParams.get('userId')
    const postId = searchParams.get('postId')
    const commentId = searchParams.get('commentId')

    if (!userId || (!postId && !commentId)) {
        return NextResponse.json({error: 'UserId and either postId or commentId are required'}, {status: 400})
    }

    await prisma.like.deleteMany({
        where: {
            userId,
            ...(postId ? {postId} : {commentId}),
        },
    })

    return NextResponse.json({message: 'Like removed successfully'})
}

