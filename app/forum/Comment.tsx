import React, {useRef, useState} from 'react';
import {Comment as CommentType} from '/mockData';
import {Button} from "@/components/ui/button"
import {format} from "date-fns";
import Image from "next/image";
import {Textarea} from "@/components/ui/textarea";
import {useRouter} from "next/navigation";
import {useOnClickOutside} from "next/dist/client/components/react-dev-overlay/internal/hooks/use-on-click-outside";

interface CommentProps {
    comment: CommentType;
}

export function Comment({comment}: CommentProps) {
    const [showReplies, setShowReplies] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const repliesPerPage = 5;
    const [childComment, setChildComment] = useState('')
    const [isComment, setIsComment] = useState(false)
    const router = useRouter()
    const [replyTo, setReplyTo] = useState<string | null>(null)
    const childCommentRef = useRef(null)
    const commentArea = useRef(null)
    const handleChildComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (childComment.trim()) {
            const response = await fetch("/api/article/comment/child-comment", {
                method: "POST",
                body: JSON.stringify({
                    replyTo: replyTo,
                    commentToId: comment.id,
                    content: childComment,
                })
            })
            if (response.ok) {
                setChildComment('')
                router.refresh()
            }
        }
    }
    const toggleReplies = () => {
        setShowReplies(!showReplies);
        setCurrentPage(1);
    };

    const handleReply = (replyTo?) => {
        setIsComment(true)
        setReplyTo(replyTo)
    }


    const paginatedReplies = comment.childComments
        ? comment.childComments.slice((currentPage - 1) * repliesPerPage, currentPage * repliesPerPage)
        : [];

    useOnClickOutside(childCommentRef.current, (event) => {
        if (event.target && (event.target as HTMLElement).textContent !== "回复") {
            setIsComment(false);
        }
    })
    return (
        <div className="flex">
            <div
                className={"w-9 mt-2 h-9 bg-blue-300 rounded-full overflow-hidden mr-2"}>
                <Image src={comment.createdBy?.image || '/avatar.png'} alt="avatar" width={100}
                       height={100}/>
            </div>
            <div className={"bg-blue-50 dark:bg-slate-700 p-4 rounded flex-1"}>
                <p className="font-semibold mb-2">{comment.createdBy.nickname || comment.createdBy.username}</p>
                <p className={'ml-3 mb-2'}>{comment.content}</p>

                {comment.childComments.length > 0 && (
                    <div className="mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleReplies}>
                            {showReplies ? '隐藏' : `显示 ${comment.childComments.length} 个评论`}
                        </Button>
                        {showReplies && (
                            <div className="ml-4 mt-2">
                                {paginatedReplies.map((reply) => (
                                    <div key={reply.id} className="mb-2 border-l-2 pl-2">
                                        <h4 className="font-bold">{reply.createdBy.nickname || reply.createdBy.username}</h4>
                                        <p>
                                            {reply.replyTo && <span className={"opacity-85 text-sm"}>回复 <span
                                                className={""}>{reply.replyTo}</span> : </span>}
                                            {reply.content}</p>
                                        <div className={'mb-2'}>
                                            <span className="text-sm text-muted-foreground mb-2">
                                                {format(reply.createdAt, 'yyyy年MM月dd日 HH:mm:ss')}</span>
                                            <span className="text-sm mb-2 ml-2 cursor-pointer" onClick={() => {
                                                handleReply(reply.createdBy.nickname || reply.createdBy.username)
                                            }}>回复</span>
                                        </div>
                                    </div>
                                ))}
                                {comment.childComments.length > repliesPerPage && (
                                    <div className="flex justify-between mt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            {"<"}
                                        </Button>
                                        <span>{`${currentPage} / ${Math.ceil(comment.childComments.length / repliesPerPage)}`}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === Math.ceil(comment.childComments.length / repliesPerPage)}
                                        >
                                            {">"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <div className={'text-right mb-2'}>
                    <span className="text-sm text-muted-foreground mb-2">
                        {format(comment.createdAt, 'yyyy年MM月dd日 HH:mm:ss')}</span>
                    <span className="text-sm mb-2 ml-2 cursor-pointer" onClick={() => {
                        handleReply()
                    }}>回复</span>
                </div>
                <div ref={childCommentRef}>
                    {isComment &&
                        <form onSubmit={handleChildComment} className="space-y-2">
                            {replyTo && <span className={'text-sm text-muted-foreground ml-2'}> 回复 {replyTo} :</span>}
                            <Textarea
                                autoFocus={true}
                                ref={commentArea}
                                className={"dark:border-slate-500 h-16 resize-none"}
                                maxLength={300}
                                placeholder="添加评论..."
                                value={childComment}
                                onChange={(e) => setChildComment(e.target.value)}
                            />
                            <Button type="submit">发表评论</Button>
                        </form>
                    }
                </div>
            </div>
        </div>
    );
}

