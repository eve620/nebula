"use client"

import React from "react"
import {usePathname, useRouter} from "next/navigation"
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"
import Link from "next/link";

const OperationBar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const getCurrentTab = () => {
        if (pathname.startsWith('/my/article')) return 'article'
        if (pathname.startsWith('/my/project')) return 'project'
        if (pathname.startsWith('/my/progress')) return 'progress'
        return 'article' // 默认值
    }
    const currentTab = getCurrentTab()

    return (
        <Tabs value={currentTab} className="w-full min-w-fit">
            <div className="flex justify-between items-center pb-2 pr-6">
                <TabsList className="grid w-[420px] grid-cols-3">
                    <TabsTrigger value="article" asChild>
                        <Link href={"/my/article"}>我的文章</Link>
                    </TabsTrigger>
                    <TabsTrigger value="project" asChild>
                        <Link href={"/my/project"}>我的项目</Link>
                    </TabsTrigger>
                    <TabsTrigger value="progress" asChild>
                        <Link href={"/my/progress"}>我的进展</Link>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="article" className="mt-0">
                    {pathname === "/my/article" &&
                        <Button onClick={() => router.push("/my/article/new")}>创建文章</Button>}
                </TabsContent>
                <TabsContent value="project" className="mt-0">
                    {pathname === "/my/project" &&
                        <Button onClick={() => router.push('/my/project/new')}>创建项目</Button>}
                </TabsContent>
                <TabsContent value="progress" className="mt-0">
                    {/* 我们不需要为进展页面添加任何按钮 */}
                </TabsContent>
            </div>
        </Tabs>
    )
}

export default OperationBar

