"use client"

import React, {useEffect} from "react"
import {usePathname, useRouter} from "next/navigation"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import useSWR, {mutate} from "swr";

const SideBar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const currentTab = pathname.split('/').pop() || "article"
    const handleTabChange = (value: string) => {
        router.push(`/message/${value}`)
    }
    useEffect(() => {
        mutate("/api/check")
    }, [pathname]);


    const {data: newMessage} = useSWR('/api/check')
    return (
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-between items-center pb-2 pr-6">
                <TabsList className="grid w-[420px] grid-cols-3">
                    <TabsTrigger value="whisper" className="relative">
                        我的消息
                        {newMessage?.hasNewMessage && (
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"/>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="reply" className="relative">
                        回复我的
                        {(newMessage?.hasNewComment) && (
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"/>
                        )}</TabsTrigger>
                    <TabsTrigger value="like" className="relative">
                        收到的赞
                        {(newMessage?.hasNewLike) && (
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"/>
                        )}</TabsTrigger>
                </TabsList>
            </div>
        </Tabs>
    )
}

export default SideBar

