import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(request) {
    // Get friends list
    const {userId} = request.query;
    const friends = await prisma.user.findUnique({
        where: {id: Number(userId)},
        select: {
            friends: {
                select: {
                    id: true,
                    username: true,
                    nickname: true,
                    image: true,
                },
            },
        },
    });
    return NextResponse.json(friends);
}

export async function POST(request: NextRequest) {
    const {senderId, receiverId} = await request.json();
    const friendRequest = await prisma.friendRequest.create({
        data: {
            senderId: Number(senderId),
            receiverId: Number(receiverId),
            status: 'PENDING',
        },
    });
    return NextResponse.json(friendRequest);

}

export async function PUT(request: NextRequest) {
    const {senderId, receiverId, accept} = await request.json();
    try {
        await prisma.friendRequest.updateMany({
            where: {
                senderId: Number(senderId),
                receiverId: Number(receiverId),
                status: 'PENDING'
            },
            data: {
                status: accept === true ? 'ACCEPTED' : "REJECTED"
            }
        });

        await prisma.user.update({
            where: {id: Number(senderId)},
            data: {
                friends: {
                    connect: {id: Number(receiverId)}
                }
            }
        });

        await prisma.user.update({
            where: {id: Number(receiverId)},
            data: {
                friends: {
                    connect: {id: Number(senderId)}
                }
            }
        });

        return NextResponse.json({message: 'Friend request accepted'});
    } catch (error) {
        return NextResponse.json({error: 'Error accepting friend request'});
    }

}