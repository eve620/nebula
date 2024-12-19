'use client'

import {useState} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {ThumbsUp, MessageSquare, Share2, Edit, ArrowLeft} from 'lucide-react'
import {ShareModal} from '@/components/modal/share-modal'
import {useUser} from "@/contexts/user-context";
import {format} from "date-fns";
import Viewer from "@/components/tiptap/viewer";
import showMessage from "@/components/message";
import {useArticles} from "@/contexts/articles-context";

export default function ForumPost() {
    const router = useRouter()
    const {id} = useParams()
    const articles = useArticles() || []
    const article = articles.filter((article) => article.id === Number(id))[0]
    const [newComment, setNewComment] = useState('')
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const user = useUser()

    const handleLike = async () => {
        if (article && user) {
            const response = await fetch("/api/article/likes", {
                method: "POST",
                body: JSON.stringify({
                    userId: user?.id,
                    articleId: article.id
                })
            })
            if (response.ok) {
                router.refresh()
            }
        } else {
            showMessage("请先登录")
        }
    }

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (article && newComment.trim()) {
            // const newCommentObj = {
            //     id: article.comments.length + 1,
            //     author: '当前用户',
            //     content: newComment,
            //     date: new Date().toISOString().split('T')[0],
            // }
            // setPost({...article, comments: [...article.comments, newCommentObj]})
            // setNewComment('')
        }
    }
    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="mb-4"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4"/>
                返回
            </Button>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                <p className="text-muted-foreground mb-4">
                    由 {article.createdBy.nickname || article.createdBy.username} 发布于 {format(new Date(article.createdAt), 'yyyy年MM月dd日 HH:mm:ss')}
                </p>
                <Viewer content={article.content}/>
                <div className="flex items-center space-x-4 mb-6">
                    <Button variant="outline" size="sm" onClick={handleLike}>
                        <ThumbsUp className="mr-2 h-4 w-4"/>
                        {article._count.likes}
                    </Button>
                    <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4"/>
                        {article.comments.length}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsShareModalOpen(true)}>
                        <Share2 className="mr-2 h-4 w-4"/>
                        分享
                    </Button>
                    {article.createdBy.username === user?.username && (
                        <Button variant="outline" size="sm"
                                onClick={() => router.push(`/forum/${article.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4"/>
                            编辑
                        </Button>
                    )}
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">评论</h2>
                    {article.comments.map((comment) => (
                        <div key={comment.id} className="bg-muted p-4 rounded">
                            <p className="font-semibold">{comment.author}</p>
                            <p className="text-sm text-muted-foreground mb-2">{comment.date}</p>
                            <p>{comment.content}</p>
                        </div>
                    ))}
                    <form onSubmit={handleComment} className="space-y-2">
                        <Textarea
                            placeholder="添加评论..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button type="submit">发表评论</Button>
                    </form>
                </div>
            </div>
            <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} articleId={article.id}/>
        </>
    )
}

