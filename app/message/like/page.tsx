import React from "react";
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";
import Link from "next/link";
import {format} from "date-fns";
import Avatar from "@/components/avatar";
import Empty from "@/components/empty";

export default async function Page() {
    const currentUser = await getCurrentUser()
    const likeList = await prisma.like.findMany({
        where: {
            articleById: currentUser?.id
        },
        select: {
            id: true,
            createdBy: {
                select: {
                    id: true,
                    username: true,
                    nickname: true,
                    image: true
                }
            },
            articleId: true,
            createdAt: true
        },
        orderBy: {createdAt: 'desc'},
    })
    return (
        <div className="space-y-4 h-[calc(100vh-11rem)] overflow-auto px-2">
            {likeList.length !== 0 ?
                likeList.map((like) => (
                    <Link href={`/forum/${like.articleId}`} key={like.id}
                          className="p-4 bg-muted rounded-lg flex items-center">
                        <Avatar url={like.createdBy.image} className={"mr-2"}/>
                        <div>
                            <h3 className="text-lg font-semibold">{like.createdBy.nickname || like.createdBy.username} 赞了我的文章</h3>
                            <p className="text-sm text-muted-foreground"> {format(like.createdAt, "yyyy年MM月dd日 HH:mm:ss")}</p>
                        </div>
                    </Link>
                )) :
                <Empty/>}
        </div>
    )
}

