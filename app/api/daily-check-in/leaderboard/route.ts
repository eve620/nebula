import {NextResponse} from 'next/server'
import {prisma} from "@/lib/prisma";

export async function GET() {
    try {
        const leaderboard = await prisma.dailyCheckIn.groupBy({
            by: ['userId'],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 5,
        })
        const leaderboardWithUserInfo = await Promise.all(
            leaderboard.map(async (entry) => {
                const user = await prisma.user.findUnique({
                    where: {id: entry.userId},
                })
                return {
                    userId: entry.userId,
                    username: user?.username,
                    nickname: user?.nickname,
                    image: user?.image,
                    totalCheckIns: entry._count.id,
                }
            })
        )

        return NextResponse.json(leaderboardWithUserInfo)
    } catch (error) {
        return NextResponse.json({error: '获取排行榜失败'}, {status: 500})
    }
}

