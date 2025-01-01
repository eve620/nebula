import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    const {receiverId, content, type} = await request.json();

    if (!receiverId || !content || !type) {
        return NextResponse.json({error: '所有字段都是必需的'}, {status: 400});
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

export async function GET(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    const {searchParams} = new URL(request.url)
    const friendId = searchParams.get('friendId')

    if (!friendId) {
        return NextResponse.json({error: '好友ID都是必需的'}, {status: 400});
    }

    try {
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
    } catch (error) {
        console.error('获取消息时发生错误:', error);
        return NextResponse.json({error: '获取消息时发生错误'}, {status: 500});
    }
}
