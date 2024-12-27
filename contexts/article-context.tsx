'use client'

import React, {createContext, useContext} from 'react';
import {Article} from "@/types";

const ArticleContext = createContext<Article >(null);

export const ArticleProvider = ({children, value}: { children: React.ReactNode, value: Article | null }) => (
    <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>
);

export const useArticle = () => useContext(ArticleContext);

