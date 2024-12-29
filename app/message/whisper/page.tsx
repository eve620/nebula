'use client'
import React, {useState} from "react";
import {Button} from "@/components/ui/button";

interface SharedPost {
    id: string;
    title: string;
    sharedBy: string;
    date: string;
}

export default function Page() {
    const [sharedPosts, setSharedPosts] = useState<SharedPost[]>([
        {id: '1', title: '绝区零最新更新讨论', sharedBy: '好友A', date: '2023-06-20'},
        {id: '2', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19'},
    ])

    return (
        <div className="space-y-4">
            {sharedPosts.map((post) => (
                <div key={post.id} className="p-4 bg-muted rounded-lg">
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">由 {post.sharedBy} 分享于 {post.date}</p>
                    <Button className="mt-2" onClick={() => { /* 跳转到帖子详情页 */
                    }}>
                        查看帖子
                    </Button>
                </div>
            ))}
        </div>
    )
}

