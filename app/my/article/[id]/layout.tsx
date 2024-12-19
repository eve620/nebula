import React from 'react';
import {prisma} from "@/lib/prisma";
import {ArticleProvider} from "@/contexts/article-context";

export default async function AdminLayout({params, children}: Readonly<{ children: React.ReactNode; }>) {
    const {id} = await params
    const article = await prisma.article.findUnique({
        where: {
            id: Number(id)
        }
    })
    if (!article) {
        // return <EmptyState/>
    }
    return (
        <ArticleProvider value={article}>
            {children}
        </ArticleProvider>
    );
}
