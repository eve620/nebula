"use client"
import {ScrollArea} from "@/components/ui/scroll-area";
import Link from "next/link";
import React from "react";
import Avatar from "@/components/avatar";
import useSWR from "swr";

export default function FriendMenu({currentId, friendList}) {
    const {data} = useSWR("/api/check")
    return (
        <div className="w-full md:w-80 border-r">
            <div className="p-4 border-b ">
                <h2 className="font-semibold truncate">消息列表</h2>
            </div>
            <ScrollArea className="h-[calc(100%-4rem)]">
                <Link href={`/message/whisper?id=0`}
                      key={0}
                      className={`flex items-center gap-3 p-4 hover:bg-muted dark:hover:bg-muted/50 cursor-pointer ${currentId && (Number(currentId) === 0) && "bg-muted dark:bg-muted/50"}`}
                >
                    <Avatar url={"/star.png"}/>
                    <div className={'w-60 relative'}>
                        <h3 className="font-medium leading-none truncate">小星云</h3>
                        <p className="text-sm text-muted-foreground mt-1 truncate">AI聊天</p>
                    </div>
                </Link>
                {friendList.map((friend) => (
                    <Link href={`/message/whisper?id=${friend.id}`}
                          key={friend.id}
                          className={`flex items-center gap-3 p-4 hover:bg-muted dark:hover:bg-muted/50 cursor-pointer ${currentId && (Number(currentId) === friend.id) && "bg-muted dark:bg-muted/50"}`}
                    >
                        <Avatar url={friend.image}/>
                        <div className={'w-60 relative'}>
                            {data && data.unreadSenders.includes(friend.id) && friend.id !== Number(currentId) && <span
                                className="absolute top-1/2 -translate-y-1/2 right-2 h-2 w-2 rounded-full bg-red-500"/>}
                            <h3 className="font-medium leading-none truncate">{friend.username}</h3>
                            <p className="text-sm text-muted-foreground mt-1 truncate">{friend.bio || "这里什么都没有..."}</p>
                        </div>
                    </Link>
                ))}
            </ScrollArea>
        </div>
    )
}