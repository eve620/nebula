import { NextResponse } from 'next/server'
import prisma from "@/prisma/client";

export async function GET(request: Request) {
  const announcements = await prisma.announcement.findMany({
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(announcements)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { title, content, authorId } = body

  const announcement = await prisma.announcement.create({
    data: { title, content, authorId },
  })

  return NextResponse.json(announcement, { status: 201 })
}

