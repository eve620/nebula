import React from 'react';
import {NoteProvider} from "@/contexts/note-context";
import prisma from "@/prisma/client";
import EmptyState from "@/components/empty-state";

export default async function AdminLayout({params, children}: Readonly<{ children: React.ReactNode; }>) {
    const {id} = await params
    const note = await prisma.note.findUnique({
        where: {
            id: Number(id)
        }
    })
    if (!note) {
        return <EmptyState/>
    }
    return (
        <NoteProvider value={note}>
            {children}
        </NoteProvider>
    );
}
