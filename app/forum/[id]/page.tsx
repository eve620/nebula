'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {ThumbsUp, MessageSquare, Share2, ArrowLeft} from 'lucide-react'
import {ShareModal} from '@/components/modal/share-modal'
import {useUser} from "@/contexts/user-context";
import {format} from "date-fns";
import Viewer from "@/components/tiptap/viewer";
import showMessage from "@/components/message";
import {useArticle} from "@/contexts/article-context";
import {CommentList} from "@/app/forum/CommentList";

export default function ForumPost() {
    const router = useRouter()
    const article = useArticle()
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const user = useUser()
    const tags = JSON.parse(article?.tags || "[]")
    const handleLike = async () => {
        if (article && user) {
            const response = await fetch("/api/article/likes", {
                method: "POST",
                body: JSON.stringify({
                    createdById: user?.id,
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
    const copyLink = async () => {
        try {
            const currentUrl = window.location.href
            await navigator.clipboard.writeText(currentUrl)
            showMessage("已复制链接！")
        } catch (err) {
            console.error('Failed to copy link:', err)
            // 如果需要，这里可以添加错误处理逻辑，比如显示一个错误提示
        }
    }
    const scrollToComment = () => {
        const comment = document.getElementById("commentModule")
        if (comment) {
            comment.scrollIntoView({behavior: "smooth"})
        }
    }
    return (
        <div className={'min-w-fit'}>
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
                <div className={"flex items-center mb-4 gap-3"}>
                    <h1 className="text-3xl font-bold mr-4">{article?.title}</h1>
                    {tags.map((item, index) =>
                        <span key={index}
                              className="tag">{item}</span>)
                    }
                </div>
                <p className="text-muted-foreground mb-4">
                    由 {article?.createdBy.nickname || article?.createdBy.username} 发布于 {format(article!.createdAt, 'yyyy年MM月dd日 HH:mm:ss')}
                </p>
                <Viewer content={article?.content || ""}/>
                <div className="flex items-center space-x-4 mb-6">
                    <Button variant="outline" size="sm" onClick={handleLike}>
                        <ThumbsUp className={`mr-2 h-4 w-4 ${article?.isLiked && "text-red-600"}`}/>
                        {article?._count.likes}
                    </Button>
                    <Button variant="outline" size="sm" onClick={scrollToComment}>
                        <MessageSquare className="mr-2 h-4 w-4"/>
                        {article?.comments.length}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                        if (user) {
                            setIsShareModalOpen(true)
                        } else {
                            copyLink()
                        }
                    }}>
                        <Share2 className="mr-2 h-4 w-4"/>
                        分享
                    </Button>
                </div>
                <CommentList comments={article!.comments}/>
            </div>
            <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} articleId={article?.id}/>
        </div>
    )
}

