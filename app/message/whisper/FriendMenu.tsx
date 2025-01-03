"use client"
import {ScrollArea} from "@/components/ui/scroll-area";
import Link from "next/link";
import React from "react";
import Avatar from "@/components/avatar";
import {useSearchParams} from "next/navigation";

export default function FriendMenu({friendList}) {
    const id = useSearchParams().get("id")
    return (
        <div className="w-full md:w-80 border-r">
            <div className="p-4 border-b ">
                <h2 className="font-semibold truncate">消息列表</h2>
            </div>
            <ScrollArea className="h-[calc(100%-4rem)]">
                {friendList.map((friend) => (
                    <Link href={`/message/whisper?id=${friend.id}`}
                          key={friend.id}
                          className={`flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer ${Number(id) === friend.id && "bg-muted/50"}`}
                    >
                        <Avatar url={friend.image}/>
                        <div className={'w-60'}>
                            <h3 className="font-medium leading-none truncate">{friend.username}</h3>
                            <p className="text-sm text-muted-foreground mt-1 truncate">{friend.bio || "这里什么都没有..."}</p>
                        </div>
                    </Link>
                ))}
            </ScrollArea>
        </div>
    )
}