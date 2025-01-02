import React from 'react';
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {ScrollArea} from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";

export default async function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
    const currentUser = await getCurrentUser()
    const friend = await prisma.friendship.findMany({
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
    const friendList = friend.map(item => item.friend)
    return (
        <div
            className="flex h-[calc(100vh-11rem)] flex-col md:flex-row border rounded-lg overflow-hidden bg-background">
            {/* Contacts List */}
            <div className="w-full md:w-80 border-r">
                <div className="p-4 border-b ">
                    <h2 className="font-semibold truncate">消息列表</h2>
                </div>
                <ScrollArea className="h-[calc(100%-4rem)]">
                    {friendList.map((friend) => (
                        <Link href={`/message/whisper?id=${friend.id}`}
                              key={friend.id}
                              className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                            <div
                                className={"w-9 h-9 bg-blue-300 rounded-full overflow-hidden"}>
                                <Image src={'/avatar.png'} alt="avatar" width={100}
                                       height={100}/>
                            </div>
                            <div className={'w-60'}>
                                <h3 className="font-medium leading-none truncate">{friend.username}</h3>
                                <p className="text-sm text-muted-foreground mt-1 truncate">{friend.bio || "这里什么都没有..."}</p>
                            </div>
                        </Link>
                    ))}
                </ScrollArea>
            </div>
            {children}
        </div>
    );
}
