import React from 'react';
import getPostList from "@/app/actions/getPostList";
import {PostProvider} from "@/contexts/post-context";

export default async function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
    const posts = await getPostList()
    return (
        <PostProvider value={posts}>
            <div className="container px-4 py-8 mx-auto h-[calc(100vh-4rem)] min-h-fit">
                {children}
            </div>
        </PostProvider>
    );
}
