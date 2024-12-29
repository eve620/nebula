"use client"

import React from "react"
import {usePathname, useRouter} from "next/navigation"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {useUser} from "@/contexts/user-context";

const OperationBar: React.FC = () => {
    const router = useRouter()
    const pathname = usePathname()
    const currentTab = pathname.split('/').pop() || "article"
    const user = useUser()
    const handleTabChange = (value: string) => {
        router.push(`/message/${value}`)
    }
    return (
        <>
            {user && (pathname === '/message/whisper' || pathname === '/message/reply' || pathname === '/message/like') &&
                <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                    <div className="flex justify-between items-center pb-2 pr-6">
                        <TabsList className="grid w-[420px] grid-cols-3">
                            <TabsTrigger value="whisper">我的消息</TabsTrigger>
                            <TabsTrigger value="reply">回复我的</TabsTrigger>
                            <TabsTrigger value="like">收到的赞</TabsTrigger>
                        </TabsList>
                    </div>
                </Tabs>}
        </>
    )
}

export default OperationBar

