'use client'

import React, {createContext, useContext} from 'react';

interface Article {
    id: number;
    title: string;
    content: string;
    tags: string,
    createdById: number;
    createdAt: Date;
    updatedAt: Date;
    viewCount: number;
    isLiked: boolean;
    isPinned: boolean;
    isLocked: boolean;
    comments: any[]
    _count: {
        likes: number
    }
    visibility: "PRIVATE" | "PUBLIC",
    createdBy: {
        username: string;
        nickname: string; // 增加了nickname
    };
}

const ArticleContext = createContext<Article | null>(null);

export const ArticleProvider = ({children, value}: { children: React.ReactNode, value: Article | null }) => (
    <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>
);

export const useArticle = () => useContext(ArticleContext);

