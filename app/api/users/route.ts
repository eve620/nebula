import { NextResponse } from 'next/server'

export async function GET() {
  // 这里应该是从数据库获取用户列表的逻辑
  const users = [
    { id: 1, username: "admin", email: "admin@example.com", role: "管理员" },
    { id: 2, username: "user1", email: "user1@example.com", role: "普通用户" },
  ]

  return NextResponse.json(users)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // 这里应该是将新用户添加到数据库的逻辑
    console.log('创建新用户:', body)

    return NextResponse.json({ message: '用户创建成功' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: '创建用户失败' }, { status: 400 })
  }
}

