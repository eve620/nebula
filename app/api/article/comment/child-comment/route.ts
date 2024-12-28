import {NextResponse} from 'next/server'
import {prisma} from "@/lib/prisma";

export async function POST(request: Request) {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
        return NextResponse.json({error: '未登录'}, {status: 403})
    }
    const {commentToId, content, replyTo} = await request.json()

    const comment = await prisma.childComment.create({
        data: {content, commentToId: Number(commentToId), createdById: Number(userId), replyTo: replyTo},
    })

    return NextResponse.json(comment, {status: 201})
}

