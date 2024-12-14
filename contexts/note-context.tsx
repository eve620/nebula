'use client'

import React, {createContext, useContext} from 'react';
import {Note} from "@/types";

const NoteContext = createContext<Note | null>(null);

export const NoteProvider = ({children, value}: { children: React.ReactNode, value: Note | null }) => (
    <NoteContext.Provider value={value}>{children}</NoteContext.Provider>
);

export const useNote = () => useContext(NoteContext);

