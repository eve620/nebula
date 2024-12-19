import { NextResponse } from 'next/server'
import {prisma} from "@/lib/prisma";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const articleId = searchParams.get('articleId')

  if (!articleId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
  }

  const comments = await prisma.comment.findMany({
    where: { articleId },
    include: { 
      author: { select: { username: true } },
      _count: { select: { likes: true } }
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(comments)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { articleId, authorId, content, parentCommentId } = body

  const comment = await prisma.comment.create({
    data: { articleId, authorId, content, parentCommentId },
  })

  return NextResponse.json(comment, { status: 201 })
}

