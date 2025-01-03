import React from 'react';
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";
import MessageBox from "@/app/message/whisper/MessageBox";
import FriendMenu from "@/app/message/whisper/FriendMenu";
import {SearchParams} from "next/dist/server/request/search-params";

type Props = {
    searchParams: SearchParams;
};

export default async function Page({searchParams}: Props) {
    const {id} =await searchParams
    const currentUser = await getCurrentUser()
    let messages = []
    if (id) {
        messages = await prisma.message.findMany({
            where: {
                OR: [
                    {senderId: currentUser?.id, receiverId: Number(id)},
                    {senderId: Number(id), receiverId: currentUser?.id}
                ]
            },
            orderBy: {
                createdAt: 'asc'
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                senderId: true
            },
        });
    }
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
                    nickname: true
                }
            }
        }
    }) || []
    const friendList = friends.map(item => item.friend)
    const friend = friendList.find(item => item.id === Number(id))
    return (
        <div
            className="flex h-[calc(100vh-11rem)] flex-col md:flex-row border rounded-lg overflow-hidden bg-background">
            <FriendMenu friendList={friendList}/>
            <MessageBox friend={friend} messageList={messages}/>
        </div>
    );
}
