'use client'

import React, {createContext, useContext} from 'react';
import {Article} from "@/types";

const ArticlesContext = createContext<Article[] | null>(null);

export const ArticlesProvider = ({children, value}: { children: React.ReactNode, value: Article[] | null }) => (
    <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>
);

export const useArticles = () => useContext(ArticlesContext);

