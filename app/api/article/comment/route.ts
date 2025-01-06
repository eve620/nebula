import {NextResponse} from 'next/server'
import {prisma} from "@/lib/prisma";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const articleId = searchParams.get('articleId')

    if (!articleId) {
        return NextResponse.json({error: 'Post ID is required'}, {status: 400})
    }

    const comments = await prisma.comment.findMany({
        where: {articleId:Number(articleId)},
        include: {
            author: {select: {username: true}},
            _count: {select: {likes: true}}
        },
        orderBy: {createdAt: 'asc'},
    })

    return NextResponse.json(comments)
}

export async function POST(request: Request) {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
        return NextResponse.json({error: '未登录'}, {status: 403})
    }
    const {articleId, content} = await request.json()
    const article = await prisma.article.findFirst({
        where: {
            id: articleId
        }
    })
    const comment = await prisma.comment.create({
        data: {content, articleId, createdById: Number(userId), articleById: article.createdById},
    })

    return NextResponse.json(comment, {status: 201})
}

