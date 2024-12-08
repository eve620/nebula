import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  // 这里应该是从数据库获取特定用户的逻辑
  const user = { id: Number(id), username: "user1", email: "user1@example.com", role: "普通用户" }

  if (user) {
    return NextResponse.json(user)
  } else {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    // 这里应该是更新数据库中特定用户的逻辑
    console.log(`更新用户 ${id}:`, body)

    return NextResponse.json({ message: '用户更新成功' })
  } catch (error) {
    return NextResponse.json({ error: '更新用户失败' }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  // 这里应该是从数据库删除特定用户的逻辑
  console.log(`删除用户 ${id}`)

  return NextResponse.json({ message: '用户删除成功' })
}

