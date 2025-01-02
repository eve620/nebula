import React from 'react';
import {prisma} from "@/lib/prisma";
import {ArticleProvider} from "@/contexts/article-context";
import getCurrentUser from "@/app/actions/getCurrentUser";

export default async function Layout({params, children}: Readonly<{ children: React.ReactNode; }>) {
    const {id} = await params
    const currentUser = await getCurrentUser()
    const article = await prisma.article.findUnique({
        where: {
            id: Number(id)
        },
        include: {
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
            {children}
        </ArticleProvider>
    );
}
