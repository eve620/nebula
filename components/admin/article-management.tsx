'use client'

import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {toast} from "@/hooks/use-toast";
import {Article} from "@/types";
import {format} from "date-fns";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Loader2} from "lucide-react";


export function ArticleManagement() {
    const [articles, setArticles] = useState<Article[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/article')
            if (!response.ok) {
                throw new Error('获取文章列表失败')
            }
            const data = await response.json()
            setArticles(data)
        } catch {
            toast({
                title: "错误",
                description: "获取文章列表失败",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeletePost = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/article`, {
                method: 'DELETE',
                body: JSON.stringify({
                    id
                })
            })
            if (!response.ok) {
                throw new Error('删除文章失败')
            }
            await fetchArticles()
            toast({
                title: "成功",
                description: "文章删除成功",
            })
        } catch {
            toast({
                title: "错误",
                description: "删除文章失败",
                variant: "destructive",
            })
        }
    }

    return (
        <>
            {isLoading ?
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-10 h-10 animate-spin text-primary"/>
                </div> :
                <div className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={'w-28'}>标题</TableHead>
                                <TableHead className={'w-28'}>日期</TableHead>
                                <TableHead>内容</TableHead>
                                <TableHead>作者</TableHead>
                                <TableHead>操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <>
                                {articles.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell>{post.title}</TableCell>
                                        <TableCell>{format(post.createdAt, "yyyy.MM.dd HH:mm:ss")}</TableCell>
                                        <TableCell>
                                            <div className={"h-40 overflow-auto"}>
                                                {post.content}
                                            </div>
                                        </TableCell>
                                        <TableCell>{post.createdBy.username}</TableCell>
                                        <TableCell>
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
                                                        <AlertDialogAction
                                                            onClick={() => handleDeletePost(post.id)}>确认删除</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        </TableBody>
                    </Table>
                </div>}
        </>
    )
}

