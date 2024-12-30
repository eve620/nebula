import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {

}

export async function POST(request: NextRequest) {
    const {senderId, receiverId} = request.body;
    try {
        const friendRequest = await prisma.friendRequest.create({
            data: {
                senderId: Number(senderId),
                receiverId: Number(receiverId),
                status: 'PENDING',
            },
        });
        return NextResponse.json(friendRequest);
    } catch (error) {
        return NextResponse.json({error: 'Error creating friend request'});
    }
}