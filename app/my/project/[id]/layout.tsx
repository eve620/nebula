import React from 'react';
import {prisma} from "@/lib/prisma";
import {ProjectProvider} from "@/contexts/project-context";

export default async function AdminLayout({params, children}) {
    const {id} = await params
    let project = await prisma.project.findUnique({
        include: {
            createdBy: {select: {nickname: true, username: true}},
        },
        where: {
            id: Number(id)
        }
    })
    if (!project) {
        return
        // return <EmptyState/>
    }
    project = {
        ...project,
        stacks: JSON.parse(project.stacks) || [],
        imageUrl: JSON.parse(project.imageUrl) || []
    }
    return (
        <ProjectProvider value={project}>
            {children}
        </ProjectProvider>
    );
}
