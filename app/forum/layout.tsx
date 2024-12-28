import React from 'react';
import getArticleList from "@/app/actions/getArticleList";
import {ArticlesProvider} from "@/contexts/articles-context";
import getTagList from "@/app/actions/getTagList";
import {TagProvider} from "@/contexts/tag-context";

export default async function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
    const articles = await getArticleList()
    const tagList: string[] = await getTagList()

    return (
        <ArticlesProvider value={articles}>
            <TagProvider value={tagList}>
                <div className="container px-4 py-8 mx-auto h-[calc(100vh-4rem)] min-h-fit">
                    {children}
                </div>
            </TagProvider>
        </ArticlesProvider>
    );
}
