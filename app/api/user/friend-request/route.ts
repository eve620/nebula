import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET() {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});

    const friendRequests = await prisma.friendRequest.findMany({
        where: {
            receiverId: currentUser.id,
        },
        include: {
            sender: {
                select: {
                    id: true,
                    username: true,
                    nickname: true,
                    image: true
                },
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
    });
    return NextResponse.json(friendRequests.map(request => request.sender));
}

export async function POST(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    const {receiverUsername} = await request.json();
    if (!receiverUsername) return NextResponse.json("用户名不能为空");
    const receiverUser = await prisma.user.findUnique({
        where: {username: receiverUsername},
    })
    if (!receiverUser) {
        return NextResponse.json("用户不存在");
    }
    if (currentUser.id === receiverUser.id) return NextResponse.json("不能添加自己为好友");
    const alreadyFriends = await prisma.friendship.findFirst({
        where: {
            userId: currentUser.id,
            friendId: receiverUser.id,
        },
    });
    if (alreadyFriends) {
        return NextResponse.json("已经是好友了");
    }
    const existingRequest = await prisma.friendRequest.findFirst({
        where: {
            OR: [{senderId: currentUser.id, receiverId: receiverUser.id,},
                {senderId: receiverUser.id, receiverId: currentUser.id,},],
        },
    });
    if (existingRequest) {
        return NextResponse.json("已经发送过了");
    }
    await prisma.friendRequest.create({
        data: {
            senderId: currentUser.id,
            receiverId: receiverUser.id,
        },
    });

    return NextResponse.json("已发送");
}

export async function PUT(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    const {friendId} = await request.json();
    try {
        const friend = await prisma.user.findUnique(
            {where: {id: Number(friendId)}}
        )
        if (!friend) {
            return NextResponse.json({error: '用户不存在'}, {status: 404});
        }

        // 检查是否已经是好友
        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    {userId: currentUser.id, friendId: Number(friendId)},
                    {userId: Number(friendId), friendId: currentUser.id}
                ]
            }
        });

        if (existingFriendship) {
            return NextResponse.json({error: '已经是好友关系'}, {status: 400});
        }
        // 添加好友关系（双向）
        await prisma.$transaction([
            prisma.friendRequest.delete({
                where: {
                    senderId_receiverId: {
                        senderId: Number(friendId),
                        receiverId: currentUser.id,
                    },
                },

            }),
            prisma.friendship.create({
                data: {
                    userId: Number(currentUser.id),
                    friendId: Number(friendId)
                }
            }),
            prisma.friendship.create({
                data: {
                    userId: Number(friendId),
                    friendId: Number(currentUser.id)
                }
            })
        ]);
        return NextResponse.json({message: '好友添加成功'});
    } catch (error) {
        console.error('添加好友时发生错误:', error);
        return NextResponse.json({error: '添加好友时发生错误'}, {status: 500});
    }

}

export async function DELETE(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    const {friendId} = await request.json();
    await prisma.friendRequest.delete({
        where: {
            senderId_receiverId: {
                senderId: Number(friendId),
                receiverId: currentUser.id,
            }
        },
    })
    return NextResponse.json({message: '已拒绝'});
}