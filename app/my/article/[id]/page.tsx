'use client'

import {useRouter} from "next/navigation"
import React, {useState} from "react"
import {Button} from "@/components/ui/button"
import Viewer from "@/components/tiptap/viewer"
import showMessage from "@/components/message"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {useArticle} from "@/contexts/article-context"
import {Edit, Share2, Trash2, Eye, EyeOff, ArrowLeft} from 'lucide-react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {format} from "date-fns";
import {ShareModal} from "@/components/modal/share-modal";

export default function Page() {
    const router = useRouter()
    const article = useArticle()
    const tags = JSON.parse(article.tags)
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)

    async function deleteArticle() {
        const deleteArticle = await fetch('/api/article', {
            method: "DELETE",
            body: JSON.stringify({
                id: article?.id
            })
        })
        if (deleteArticle.ok) {
            router.push('/my/article')
            router.refresh()
            showMessage("删除成功")
        } else {
            showMessage("删除失败")
        }
    }

    async function changeVisibility() {
        const changeArticle = await fetch("/api/article", {
            method: "PUT",
            body: JSON.stringify({
                id: article?.id,
                visibility: article.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC"
            })
        })
        if (changeArticle.ok) {
            showMessage("修改成功！")
            router.refresh()
        } else {
            showMessage("修改失败")
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                        <Button variant="ghost" onClick={() => router.push("/my/article")}>
                            <ArrowLeft className="mr-2 h-4 w-4"/> 返回
                        </Button>
                        <div className="flex items-center space-x-2">

                            <div>
                                <p className="text-xs text-muted-foreground">{format(article.createdAt,"yyyy年MM月dd日")}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'flex'}>
                        <CardTitle className="text-3xl font-bold mb-2">{article.title}</CardTitle>
                        <div className="flex items-center flex-wrap gap-2">
                            {tags.map((item, index) =>
                                <span key={index} className="tag">{item}</span>)
                            }
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">
                                    {article.visibility === "PUBLIC" ? <Eye className="mr-2 h-4 w-4"/> :
                                        <EyeOff className="mr-2 h-4 w-4"/>}
                                    {article.visibility === "PUBLIC" ? "公开" : "私有"}</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>切换{article.visibility !== "PUBLIC" ? "公开" : "私有"}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        当前文章为{article.visibility === "PUBLIC" ? "公开" : "私有"}，你要设置为私有吗？
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction onClick={changeVisibility}>确认</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button variant="outline" onClick={() => router.push(`/my/article/${article.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4"/> 编辑
                        </Button>
                        <Button variant="outline" onClick={() => {
                            setIsShareModalOpen(true)
                        }}>
                            <Share2 className="mr-2 h-4 w-4"/> 分享
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">
                                    <Trash2 className="mr-2 h-4 w-4"/> 删除
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        此操作无法撤消。这将永久删除您的笔记，且无法恢复。
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction onClick={deleteArticle}>确认删除</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                        <Viewer content={article.content}/>
                    </div>
                </CardContent>
            </Card>
            <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} articleId={article?.id}/>
        </div>
    )
}

