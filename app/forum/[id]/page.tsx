import React from 'react';
import {prisma} from "@/lib/prisma";
import {ArticleProvider} from "@/contexts/article-context";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ArticleContent from "@/app/forum/[id]/ArticleContent";

export default async function Page({params}) {
    const {id} = await params
    const currentUser = await getCurrentUser()
    const article = await prisma.article.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            createdBy: {select: {nickname: true, username: true}},
            _count: {select: {likes: true}},
            comments: {
                include: {
                    createdBy: {select: {image: true, nickname: true, username: true}},
                    childComments: {
                        include: {
                            createdBy: {select: {image: true, nickname: true, username: true}},
                        },
                        orderBy: {createdAt: 'asc'},
                    }
                },
                orderBy: {createdAt: 'asc'},
            },
            likes: currentUser?.id ? {
                where: {
                    createdById: currentUser.id
                },
                take: 1
            } : false
        }
    })
    article.isLiked = currentUser?.id ? article?.likes.length > 0 : false
    delete article.likes
    if (!article) {
        return
        // return <EmptyState/>
    }
    return (
        <ArticleProvider value={article}>
            <ArticleContent/>
        </ArticleProvider>
    );
}
