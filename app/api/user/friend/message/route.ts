import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});

        const {searchParams} = new URL(request.url)
        const id = searchParams.get('id')
        const offset = parseInt(searchParams.get('offset') || '0', 10)
        const limit = parseInt(searchParams.get('limit') || '10', 10)
        if (!id) {
            return NextResponse.json({error: '好友ID是必需的'}, {status: 400});
        }

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {senderId: currentUser?.id, receiverId: Number(id)},
                    {senderId: Number(id), receiverId: currentUser?.id}
                ]
            },
            orderBy: {
                createdAt: 'desc'  // 改为降序，最新的消息先显示
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                senderId: true,
                type: true
            },
            skip: offset,
            take: limit
        });

        // 更新未读消息状态
        await prisma.message.updateMany({
            where: {senderId: Number(id), receiverId: currentUser?.id, isRead: false},
            data: {isRead: true}
        })

        const totalCount = await prisma.message.count({
            where: {
                OR: [
                    {senderId: currentUser?.id, receiverId: Number(id)},
                    {senderId: Number(id), receiverId: currentUser?.id}
                ]
            }
        });

        return NextResponse.json({
            messages,
            hasMore: offset + limit < totalCount
        });
    } catch (error) {
        console.error('获取消息时发生错误:', error);
        return NextResponse.json({error: '获取消息时发生错误'}, {status: 500});
    }
}

// export async function GET(request: NextRequest) {
//
//     try {
//         const currentUser = await getCurrentUser()
//         if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
//         const {searchParams} = new URL(request.url)
//         const id = searchParams.get('id')
//         if (!id) {
//             return NextResponse.json({error: '好友ID都是必需的'}, {status: 400});
//         }
//         const messages = await prisma.message.findMany({
//             where: {
//                 OR: [
//                     {senderId: currentUser?.id, receiverId: Number(id)},
//                     {senderId: Number(id), receiverId: currentUser?.id}
//                 ]
//             },
//             orderBy: {
//                 createdAt: 'asc'
//             },
//             select: {
//                 id: true,
//                 content: true,
//                 createdAt: true,
//                 senderId: true,
//                 type: true
//             },
//         });
//         await prisma.message.updateMany({
//             where: {senderId: Number(id), receiverId: currentUser?.id, isRead: false},
//             data: {isRead: true}
//         })
//         return NextResponse.json(messages);
//     } catch (error) {
//         console.error('获取消息时发生错误:', error);
//         return NextResponse.json({error: '获取消息时发生错误'}, {status: 500});
//     }
// }

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