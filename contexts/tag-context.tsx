'use client'

import React, {createContext, useContext} from 'react';

const TagContext = createContext<string[] | null>(null);

export const TagProvider = ({children, value}: { children: React.ReactNode, value: string[] | null }) => (
    <TagContext.Provider value={value}>{children}</TagContext.Provider>
);

export const useTag = () => useContext(TagContext);

