import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: NextRequest) {

    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
        const {searchParams} = new URL(request.url)
        const checkOnly = searchParams.get('checkOnly') === 'true';
        if (checkOnly) {
            const unreadMessageCount = await prisma.message.count({
                where: {
                    receiverId: currentUser.id,
                    isRead: false
                },
            });
            return NextResponse.json({unreadMessage: unreadMessageCount > 0});
        } else {
            const friendId = searchParams.get('id')
            if (!friendId) {
                return NextResponse.json({error: '好友ID都是必需的'}, {status: 400});
            }
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        {senderId: currentUser.id, receiverId: Number(friendId)},
                        {senderId: Number(friendId), receiverId: currentUser.id}
                    ]
                },
                orderBy: {
                    createdAt: 'asc'
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            nickname: true,
                            image: true
                        }
                    },
                    receiver: {
                        select: {
                            id: true,
                            username: true,
                            nickname: true,
                            image: true
                        }
                    }
                }
            });

            return NextResponse.json(messages);
        }
    } catch (error) {
        console.error('获取消息时发生错误:', error);
        return NextResponse.json({error: '获取消息时发生错误'}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    const {receiverId, content, type} = await request.json();

    if (!receiverId || !content) {
        return NextResponse.json({error: '字段都是必需的'}, {status: 400});
    }

    try {
        const message = await prisma.message.create({
            data: {
                senderId: currentUser.id,
                receiverId: Number(receiverId),
                content,
                type,
            },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error('发送消息时发生错误:', error);
        return NextResponse.json({error: '发送消息时发生错误'}, {status: 500});
    }
}