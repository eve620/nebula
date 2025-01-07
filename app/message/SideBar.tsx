"use client"

import React, {useEffect} from "react"
import {usePathname, useRouter, useSearchParams} from "next/navigation"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import useSWR, {mutate} from "swr";

const SideBar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentFriendId = searchParams.get("id") && Number(searchParams.get("id"))
    const {data} = useSWR('/api/check')
    const currentTab = pathname.split('/').pop() || "article"
    const handleTabChange = (value: string) => {
        router.push(`/message/${value}`)
    }
    useEffect(() => {
        mutate("/api/check")
    }, [pathname]);


    return (
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-between items-center pb-2 pr-6">
                <TabsList className="grid w-[420px] grid-cols-3">
                    <TabsTrigger aria-controls={null} value="whisper" className="relative">
                        我的消息
                        {(data?.unreadSenders.length > 1 || (data?.unreadSenders.length === 1 && currentFriendId !== data?.unreadSenders[0])) &&
                            (
                                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"/>
                            )}
                    </TabsTrigger>
                    <TabsTrigger aria-controls={null} value="reply" className="relative">
                        回复我的
                        {(data?.hasNewComment) && (
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"/>
                        )}
                    </TabsTrigger>
                    <TabsTrigger aria-controls={null} value="like" className="relative">
                        收到的赞
                        {(data?.hasNewLike) && (
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"/>
                        )}
                    </TabsTrigger>
                </TabsList>
            </div>
        </Tabs>
    )
}

export default SideBar

