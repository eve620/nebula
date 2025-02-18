import React from "react";
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";
import Avatar from "@/components/avatar";
import {format} from "date-fns";
import Link from "next/link";
import Empty from "@/components/empty";

export default async function Page() {
    const currentUser = await getCurrentUser()
    const articleReplyList = await prisma.comment.findMany({
        where: {
            articleById: currentUser?.id
        },
        select: {
            id: true,
            articleId: true,
            content: true,
            createdAt: true,
            createdBy: {
                select: {
                    id: true,
                    username: true,
                    nickname: true,
                    image: true
                }
            }
        },
        orderBy: {createdAt: 'desc'},
    })
    const commentReplyList = await prisma.childComment.findMany({
        where: {
            commentToById: currentUser?.id
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            createdBy: {
                select: {
                    id: true,
                    username: true,
                    nickname: true,
                    image: true
                }
            },
            commentTo: {
                include: {
                    article: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        },
        orderBy: {createdAt: 'desc'},
    })
    commentReplyList.map(item => {
        item.articleId = item.commentTo.article.id
        delete item.commentTo
    })
    const combinedList = articleReplyList.concat(commentReplyList);
    combinedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="space-y-4 h-[calc(100vh-11rem)] overflow-auto px-2">
            {combinedList.length !== 0 ?
                combinedList.map((reply) => (
                    <Link href={`/forum/${reply.articleId}`} key={reply.id}
                          className="p-4 bg-muted rounded-lg flex items-center">
                        <div
                            className={"w-9 mt-2 h-9 rounded-full overflow-hidden mr-2"}>
                            <Avatar url={reply.createdBy.image}/>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{reply.content} 回复了我的评论</h3>
                            <p className="text-muted-foreground"> {reply.content}</p>
                            <p className="text-sm text-muted-foreground"> {format(reply.createdAt, "yyyy年MM月dd日 HH:mm:ss")}</p>
                        </div>
                    </Link>
                )) :
                <Empty/>}
        </div>
    )
}

