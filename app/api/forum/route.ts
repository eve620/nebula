import {NextResponse} from 'next/server'
import {prisma} from "@/lib/prisma";

export async function GET(request: Request) {
    const posts = await prisma.post.findMany({
        include: {
            author: {select: {nickname: true, username: true}},
            _count: {select: {likes: true}},
            comments: true
        },
        orderBy: {createdAt: 'desc'},
    })
    return NextResponse.json(posts)
}

export async function POST(request: Request) {
    const body = await request.json()
    const {title, content, createdById} = body
    console.log(title)
    const post = await prisma.post.create({
        data: {title, content, createdById},
    })

    return NextResponse.json(post, {status: 201})
}

