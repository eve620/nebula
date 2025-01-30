import React from 'react';
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";
import MessageBox from "@/app/message/whisper/MessageBox";
import FriendMenu from "@/app/message/whisper/FriendMenu";

export default async function Page({searchParams}) {
    const {id} = await searchParams
    const currentUser = await getCurrentUser()
    const friends = await prisma.friendship.findMany({
        where: {
            userId: currentUser?.id
        },
        include: {
            friend: {
                select: {
                    id: true,
                    image: true,
                    username: true,
                    nickname: true,
                }
            },
        }
    }) || []
    const friendList = friends.map(item => item.friend)
    const friend = friendList.find(item => item.id === Number(id))
    let messages = []
    let totalCount = 0
    if (id) {
        messages = await prisma.message.findMany({
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
            skip: 0,
            take: 10
        });
        // 更新未读消息状态
        await prisma.message.updateMany({
            where: {senderId: Number(id), receiverId: currentUser?.id, isRead: false},
            data: {isRead: true}
        })
        totalCount = await prisma.message.count({
            where: {
                OR: [
                    {senderId: currentUser?.id, receiverId: Number(id)},
                    {senderId: Number(id), receiverId: currentUser?.id}
                ]
            }
        });
    }


    return (
        <div
            className="flex h-[calc(100vh-11rem)] flex-col md:flex-row border rounded-lg overflow-hidden bg-background">
            <FriendMenu currentId={id} friendList={friendList}/>
            <MessageBox currentId={id} messageList={messages.reverse()} more={5 < totalCount} friend={friend}/>
        </div>
    );
}
