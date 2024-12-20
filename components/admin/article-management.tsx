'use client'

import {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {toast} from "@/hooks/use-toast";
import {Article} from "@/types";
import {format} from "date-fns";


export function ArticleManagement() {
    const [articles, setArticles] = useState<Article[]>([])
    const [newPost, setNewPost] = useState({title: '', content: '', author: ''})
    const [editingPost, setEditingPost] = useState<Article | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        try {
            const response = await fetch('/api/article')
            if (!response.ok) {
                throw new Error('获取文章列表失败')
            }
            const data = await response.json()
            setArticles(data)
        } catch (error) {
            toast({
                title: "错误",
                description: "获取文章列表失败",
                variant: "destructive",
            })
        }
    }

    const handleDeletePost = (id: number) => {
    }

    const handleEditPost = (article: Article) => {
        setEditingPost(article)
        setIsEditModalOpen(true)
    }

    const handleSaveEdit = () => {
        if (editingPost) {
            setIsEditModalOpen(false)
            setEditingPost(null)
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <Input
                    placeholder="标题"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
                <Input
                    placeholder="作者"
                    value={newPost.author}
                    onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>标题</TableHead>
                        <TableHead>日期</TableHead>
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
                                <TableCell>{format(post.createdAt, "yyyy年MM月dd日 HH:mm:ss")}</TableCell>
                                <TableCell>{post.content}</TableCell>
                                <TableCell>{post.createdBy.username}</TableCell>
                                <TableCell>
                                    <Button variant="outline" className="mr-2"
                                            onClick={() => handleEditPost(post)}>编辑</Button>
                                    <Button variant="destructive"
                                            onClick={() => handleDeletePost(post.id)}>删除</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </>
                </TableBody>
            </Table>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>编辑帖子</DialogTitle>
                    </DialogHeader>
                    <>
                        {editingPost && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">
                                        标题
                                    </Label>
                                    <Input
                                        id="title"
                                        value={editingPost.title}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="content" className="text-right">
                                        内容
                                    </Label>
                                    <Textarea
                                        id="content"
                                        value={editingPost.content}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="author" className="text-right">
                                        作者
                                    </Label>
                                    <Input
                                        id="author"
                                        value={editingPost.createdBy.username}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                        )}
                    </>
                    <DialogFooter>
                        <Button onClick={handleSaveEdit}>保存</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

