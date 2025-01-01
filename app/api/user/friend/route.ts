import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET() {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});

    try {
        const friendships = await prisma.friendship.findMany({
            where: {
                userId: currentUser.id
            },
            include: {
                friend: {
                    select: {
                        id: true,
                        username: true,
                        nickname: true,
                        image: true,
                        bio: true
                    }
                }
            }
        });

        const friends = friendships.map(friendship => friendship.friend);

        return NextResponse.json(friends);
    } catch (error) {
        console.error('获取好友列表时发生错误:', error);
        return NextResponse.json({error: '获取好友列表时发生错误'}, {status: 500});
    }
}

export async function DELETE(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});

    const {friendId} = await request.json();

    if (!friendId) {
        return NextResponse.json({error: '需要好友信息'}, {status: 400});
    }

    try {
        await prisma.$transaction([
            prisma.friendship.deleteMany({
                where: {
                    OR: [
                        {userId: currentUser.id, friendId: Number(friendId)},
                        {userId: Number(friendId), friendId: currentUser.id}
                    ]
                },
            }),
        ]);

        return NextResponse.json({message: '好友关系删除成功'});
    } catch (error) {
        console.error('Error deleting friendship:', error);
        return NextResponse.json({error: '删除好友关系时发生错误'}, {status: 500});
    }
}