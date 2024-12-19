import {NextResponse} from 'next/server'
import {prisma} from "@/lib/prisma";

export async function GET() {
    const articles = await prisma.article.findMany({
        include: {
            author: {select: {nickname: true, username: true}},
            _count: {select: {likes: true}},
            comments: true
        },
        orderBy: {createdAt: 'desc'},
    })
    return NextResponse.json(articles)
}

export async function POST(request: Request) {
    const body = await request.json()
    const {title, content, tags, createdById} = body
    const article = await prisma.article.create({
        data: {title, content, tags, createdById},
    })

    return NextResponse.json(article, {status: 201})
}

