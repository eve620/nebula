import { NextResponse } from 'next/server'
import {prisma} from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        dailyCheckIns: {
          where: {
            checkInDate: {
              gte: firstDayOfMonth,
            },
          },
          orderBy: {
            checkInDate: 'desc',
          },
          take: 1,
        },
      },
      orderBy: [
        {
          dailyCheckIns: {
            _count: 'desc',
          },
        },
        {
          dailyCheckIns: {
            streak: 'desc',
          },
        },
      ],
      take: 10,
    })

    const formattedLeaderboard = leaderboard.map((user) => ({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      monthlyCheckIns: user.dailyCheckIns[0]?.monthlyCheckIns || 0,
      currentStreak: user.dailyCheckIns[0]?.streak || 0,
    }))

    return NextResponse.json(formattedLeaderboard)
  } catch (error) {
    console.error('获取排行榜失败:', error)
    return NextResponse.json({ message: '获取排行榜失败，请稍后重试' }, { status: 500 })
  }
}

