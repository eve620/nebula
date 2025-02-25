import React from 'react';
import {prisma} from "@/lib/prisma";
import {ArticleProvider} from "@/contexts/article-context";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ArticleContent from "@/app/forum/[id]/ArticleContent";
import {notFound} from "next/navigation";

export default async function Page({params}) {
    const {id} = await params
    const currentUser = await getCurrentUser()
    const article = await prisma.article.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            createdBy: {select: {nickname: true, username: true}},
            comments: {
                include: {
                    createdBy: {select: {image: true, nickname: true, username: true}},
                    childComments: {
                        include: {
                            createdBy: {select: {image: true, nickname: true, username: true}},
                        },
                        orderBy: {createdAt: 'asc'},
                    },
                },
                orderBy: {createdAt: 'asc'},
            },
        },
    });
    if (!article) {
        notFound()
    }
    // 单独查询点赞数
    const likeCount = await prisma.like.count({
        where: {
            articleId: Number(id),
        },
    });
    // 单独查询当前用户是否点赞
    let isLiked = false;
    if (currentUser?.id) {
        const userLike = await prisma.like.findFirst({
            where: {
                articleId: Number(id),
                createdById: currentUser.id,
            },
        });
        isLiked = !!userLike;
    }

    return (
        <ArticleProvider value={article}>
            <ArticleContent isLiked={isLiked} likeCount={likeCount}/>
        </ArticleProvider>
    );
}
