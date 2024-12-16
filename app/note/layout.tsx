import React from 'react';
import getTagList from "@/app/actions/getTagList";
import {TagProvider} from "@/contexts/tag-context";

export default async function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
    const tagList: string[] = await getTagList() || []
    return (
        <TagProvider value={tagList}>
            <div className="container px-4 py-8 mx-auto h-[calc(100vh-4rem)] min-h-fit">
                {children}
            </div>
        </TagProvider>
    );
}
