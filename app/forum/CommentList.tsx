"use client"
import React, {useState} from 'react';
import {Comment} from './Comment';
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea";
import showMessage from "@/components/message";
import {useParams, useRouter} from "next/navigation";

export function CommentList({comments}: { comments: any[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;
    const {id} = useParams()
    const router = useRouter()
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
    const [newComment, setNewComment] = useState('')
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log(111)
        if (newComment.trim()) {
            const response = await fetch("/api/article/comment", {
                method: "POST",
                body: JSON.stringify({
                    articleId: id,
                    content: newComment,
                })
            })
            if (response.ok) {
                router.refresh()
                setNewComment('')
            }
        } else {
            showMessage("内容不能为空")
        }
    }

    return (
        <div className="mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">评论</h2>
            <div className={"space-y-4"}>
                {currentComments.map((comment) => (
                    <Comment key={comment.id} comment={comment}/>
                ))}
                <div className="flex justify-center mt-4">
                    {Array.from({length: Math.ceil(comments.length / commentsPerPage)}, (_, i) => (
                        <Button
                            key={i}
                            variant={currentPage === i + 1 ? "default" : "outline"}
                            size="sm"
                            className="mx-1"
                            onClick={() => paginate(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </div>
                <form onSubmit={handleComment} className="space-y-2" id={"commentModule"}>
                    <Textarea
                        className={"dark:border-slate-700 h-28 resize-none"}
                        maxLength={300}
                        placeholder="添加评论..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button type="submit">发表评论</Button>
                </form>
            </div>
        </div>
    );
}

