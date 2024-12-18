"use client"

import React from "react"
import {usePathname, useRouter} from "next/navigation"
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"
import useTagModal from "@/hooks/use-tag-modal"
import {useUser} from "@/contexts/user-context";

const OperationBar: React.FC = () => {
    const router = useRouter()
    const tagStore = useTagModal()
    const pathname = usePathname()
    const currentTab = pathname.split('/').pop() || "article"
    const user = useUser()
    const handleTabChange = (value: string) => {
        router.push(`/my/${value}`)
    }

    return (
        <>
            {user && (pathname === "/my/article" || pathname === "/my/project") &&
                <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                    <div className="flex justify-between items-center pb-2 pr-6">
                        <TabsList className="grid w-56 grid-cols-2">
                            <TabsTrigger value="article">我的文章</TabsTrigger>
                            <TabsTrigger value="project">我的项目</TabsTrigger>
                        </TabsList>
                        <TabsContent value="article" className="mt-0">
                            <div className="space-x-3">
                                <Button onClick={() => router.push("/my/article/new")}>创建文章</Button>
                                <Button onClick={tagStore.onOpen}>编辑标签</Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="project" className="mt-0">
                            <Button onClick={() => router.push('/my/project/new')}>创建项目</Button>
                        </TabsContent>
                    </div>
                </Tabs>}
        </>
    )
}

export default OperationBar

