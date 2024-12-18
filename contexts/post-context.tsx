'use client'

import React, {createContext, useContext} from 'react';
import {Post} from "@/types";

const PostContext = createContext<Post[] | null>(null);

export const PostProvider = ({children, value}: { children: React.ReactNode, value: Post[] | null }) => (
    <PostContext.Provider value={value}>{children}</PostContext.Provider>
);

export const usePost = () => useContext(PostContext);

