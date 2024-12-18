import { NextResponse } from 'next/server'
import {prisma} from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json()
  const { userId } = body

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    // 检查用户今天是否已经打卡
    const existingCheckIn = await prisma.dailyCheckIn.findFirst({
      where: {
        userId,
        checkInDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })

    if (existingCheckIn) {
      return NextResponse.json({ message: '今天已经打卡过了' }, { status: 400 })
    }

    // 获取用户最后一次打卡记录
    const lastCheckIn = await prisma.dailyCheckIn.findFirst({
      where: { userId },
      orderBy: { checkInDate: 'desc' },
    })

    let streak = 1
    let monthlyCheckIns = 1

    if (lastCheckIn) {
      const lastCheckInDate = new Date(lastCheckIn.checkInDate)
      lastCheckInDate.setHours(0, 0, 0, 0)

      // 检查是否是连续打卡
      if ((today.getTime() - lastCheckInDate.getTime()) / (24 * 60 * 60 * 1000) === 1) {
        streak = lastCheckIn.streak + 1
      }

      // 更新本月打卡次数
      if (lastCheckInDate.getMonth() === today.getMonth() && lastCheckInDate.getFullYear() === today.getFullYear()) {
        monthlyCheckIns = lastCheckIn.monthlyCheckIns + 1
      }
    }

    // 创建新的打卡记录
    const newCheckIn = await prisma.dailyCheckIn.create({
      data: {
        userId,
        streak,
        monthlyCheckIns,
      },
    })

    return NextResponse.json(newCheckIn, { status: 201 })
  } catch (error) {
    console.error('打卡失败:', error)
    return NextResponse.json({ message: '打卡失败，请稍后重试' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
  const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString())

  if (!userId) {
    return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
  }

  try {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const checkIns = await prisma.dailyCheckIn.findMany({
      where: {
        userId,
        checkInDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        checkInDate: 'asc',
      },
    })

    const lastCheckIn = await prisma.dailyCheckIn.findFirst({
      where: { userId },
      orderBy: { checkInDate: 'desc' },
    })

    const calendarData = Array.from({ length: endDate.getDate() }, (_, i) => {
      const date = new Date(year, month - 1, i + 1)
      const checkIn = checkIns.find(ci => new Date(ci.checkInDate).getDate() === i + 1)
      return {
        date: date.toISOString().split('T')[0],
        isCheckedIn: !!checkIn,
      }
    })

    return NextResponse.json({
      calendarData,
      currentStreak: lastCheckIn?.streak || 0,
      monthlyCheckIns: checkIns.length,
    })
  } catch (error) {
    console.error('获取打卡记录失败:', error)
    return NextResponse.json({ message: '获取打卡记录失败，请稍后重试' }, { status: 500 })
  }
}

