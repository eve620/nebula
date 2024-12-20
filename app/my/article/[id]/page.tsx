"use client"
import {useRouter} from "next/navigation";
import React from "react";
import {Button} from "@/components/ui/button";
import Viewer from "@/components/tiptap/viewer";
import showMessage from "@/components/message";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useArticle} from "@/contexts/article-context";

export default function Page() {
    const article = useArticle()
    const router = useRouter()
    const tags = JSON.parse(article?.tags || "[]")

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

    return (
        <div>
            <div className="flex gap-4 items-center">
                        <span
                            className="flex flex-nowrap text-nowrap text-gray-500 dark:text-gray-300 items-center gap-1.5 break-words text-xl text-muted-foreground sm:gap-2.5">
                            <span className={"cursor-pointer"} onClick={() => {
                                router.push("/my/article")
                            }}>Home</span><span
                            className={"cursor-default select-none"}>/</span><span>{article?.title}</span>
                        </span>
                {tags.map((item, index) =>
                    <span key={index} className="ml-1 bg-pink-300/20 dark:bg-blue-300/30 px-2 rounded-lg">{item}</span>)
                }
                <div className={"flex-1"}></div>
                <Button onClick={() => {
                    router.push(`/my/article/${article?.id}/edit`)
                }}>编辑</Button>
                <Button onClick={() => {
                    showMessage("share")
                }}>分享</Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button>删除</Button>
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
                <Button onClick={() => {
                    router.push("/my/article")
                }}>返回</Button>
            </div>
            <div>
                <Viewer content={article?.content || ""}/>
            </div>
        </div>
    )
}