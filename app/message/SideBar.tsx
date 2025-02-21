"use client"

import React, {useEffect} from "react"
import {usePathname, useSearchParams} from "next/navigation"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import useSWR, {mutate} from "swr";
import Link from "next/link";

const SideBar = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentFriendId = searchParams.get("id") && Number(searchParams.get("id"))
    const {data} = useSWR('/api/check')
    const currentTab = pathname.split('/').pop() || "whisper"

    useEffect(() => {
        setTimeout(() => {
            mutate("/api/check")
        }, 300)
    }, [pathname]);


    return (
        <Tabs value={currentTab} className="w-full min-w-fit">
            <div className="flex justify-between items-center pb-2 pr-6">
                <TabsList className="grid w-[420px] grid-cols-3">
                    <TabsTrigger value="whisper" asChild>
                        <Link href={"/message/whisper"} className="relative">
                            我的消息
                            {(data?.unreadSenders.length > 1 || (data?.unreadSenders.length === 1 && currentFriendId !== data?.unreadSenders[0])) && (
                                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"/>
                            )}
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="reply" asChild>
                        <Link href={"/message/reply"} className="relative">
                            回复我的
                            {data?.hasNewComment && (
                                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"/>
                            )}
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="like" asChild>
                        <Link href={"/message/like"} className="relative">
                            收到的赞
                            {data?.hasNewLike && (
                                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"/>
                            )}
                        </Link>
                    </TabsTrigger>
                </TabsList>
            </div>
        </Tabs>
    )
}

export default SideBar

