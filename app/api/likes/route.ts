import { NextResponse } from 'next/server'
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  const body = await request.json()
  const { userId, postId, commentId } = body

  if (!postId && !commentId) {
    return NextResponse.json({ error: 'Either postId or commentId is required' }, { status: 400 })
  }

  const like = await prisma.like.create({
    data: { userId, postId, commentId },
  })

  return NextResponse.json(like, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const postId = searchParams.get('postId')
  const commentId = searchParams.get('commentId')

  if (!userId || (!postId && !commentId)) {
    return NextResponse.json({ error: 'UserId and either postId or commentId are required' }, { status: 400 })
  }

  await prisma.like.deleteMany({
    where: {
      userId,
      ...(postId ? { postId } : { commentId }),
    },
  })

  return NextResponse.json({ message: 'Like removed successfully' })
}

