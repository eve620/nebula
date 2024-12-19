import React from 'react';
import getArticleList from "@/app/actions/getArticleList";
import {ArticlesProvider} from "@/contexts/articles-context";

export default async function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
    const articles = await getArticleList()
    return (
        <ArticlesProvider value={articles}>
            <div className="container px-4 py-8 mx-auto h-[calc(100vh-4rem)] min-h-fit">
                {children}
            </div>
        </ArticlesProvider>
    );
}
