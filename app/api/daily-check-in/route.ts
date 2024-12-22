import {NextResponse} from 'next/server'
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
    const {userId} = await request.json()
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        // 检查用户今天是否已经打卡
        const existingCheckIn = await prisma.dailyCheckIn.findFirst({
            where: {
                userId: parseInt(userId),
                checkInDate: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
        })
        if (existingCheckIn) {
            return NextResponse.json({error: '今天已经打卡过了，明天再来吧~'}, {status: 400})
        }
        await prisma.dailyCheckIn.create({
            data: {
                userId: parseInt(userId),
                checkInDate: today,
            },
        });
        return NextResponse.json({message: "打卡成功!"}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: '打卡失败'}, {status: 500})
    }
}

export async function GET() {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return NextResponse.json({error: '未登录'}, {status: 400})
    }
    try {
        const user = await prisma.user.findUnique({
            where: {id: currentUser.id},
            include: {dailyCheckIn: true},
        })
        if (!user) {
            return NextResponse.json({error: '无用户'}, {status: 400})
        }
        const today = new Date()
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        const monthlyCheckIns = user.dailyCheckIn.filter(
            (checkIn) => checkIn.checkInDate >= firstDayOfMonth
        ).length

        const sortedCheckIns = user.dailyCheckIn.sort((a, b) => b.checkInDate.getTime() - a.checkInDate.getTime())
        let currentStreak = 0
        let lastCheckIn = new Date(today)
        lastCheckIn.setHours(0, 0, 0, 0)
        for (const checkIn of sortedCheckIns) {
            const checkInDate = new Date(checkIn.checkInDate)
            checkInDate.setHours(0, 0, 0, 0)
            if (lastCheckIn.getTime() - checkInDate.getTime() === 0) {
                currentStreak++
                continue
            }
            if (lastCheckIn.getTime() - checkInDate.getTime() === 86400000) {
                currentStreak++
                lastCheckIn = checkInDate
            } else if (lastCheckIn.getTime() !== checkInDate.getTime()) {
                break
            }
        }

        const checkedInDates = user.dailyCheckIn.map((checkIn) => checkIn.checkInDate)
        return NextResponse.json({
            monthlyCheckIns,
            currentStreak,
            checkedInDates,
        })
    } catch (error) {
        return NextResponse.json({message: '打卡失败'}, {status: 500})
    }
}

