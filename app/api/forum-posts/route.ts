import { NextResponse } from 'next/server'
import prisma from "@/prisma/client";

export async function GET(request: Request) {
  const posts = await prisma.forumPost.findMany({
    include: { 
      author: { select: { username: true } },
      _count: { select: { comments: true, likes: true } }
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { title, content, authorId } = body

  const post = await prisma.forumPost.create({
    data: { title, content, authorId },
  })

  return NextResponse.json(post, { status: 201 })
}

