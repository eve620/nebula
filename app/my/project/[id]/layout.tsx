import React from 'react';
import {prisma} from "@/lib/prisma";
import {ArticleProvider} from "@/contexts/article-context";
import {ProjectProvider} from "@/contexts/project-context";

export default async function AdminLayout({params, children}: Readonly<{ children: React.ReactNode; }>) {
    const {id} = await params
    const project = await prisma.project.findUnique({
        where: {
            id: Number(id)
        }
    })
    if (!project) {
        return
        // return <EmptyState/>
    }
    return (
        <ProjectProvider value={project}>
            {children}
        </ProjectProvider>
    );
}
