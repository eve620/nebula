'use client'
import React, {useState} from "react";
import Image from "next/image";

export default function Page() {

    // const { data, error } = useSWR('/api/news', fetcher, {
    //     refreshInterval: 10000,  // 设置每 10 秒刷新一次
    // });
    
    const [sharedPosts, setSharedPosts] = useState([
        {id: '1', title: '绝区零最新更新讨论', sharedBy: '好友A', date: '2023-06-20'},
        {id: '2', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19'},
        {id: '3', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19'},
        {id: '4', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19'},
        {id: '5', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19'},
        {id: '6', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19'},
        {id: '7', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19'},
        {id: '8', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19'},
        {id: '9', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19'},
        {id: '10', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19'},
    ])
    return (
        <div className="space-y-4 h-[calc(100vh-11rem)] overflow-auto px-2">
            {sharedPosts.map((post) => (
                <div key={post.id} className="p-4 bg-muted rounded-lg flex items-center">
                    <div
                        className={"w-9 mt-2 h-9 bg-blue-300 rounded-full overflow-hidden mr-2"}>
                        <Image src={ '/avatar.png'} alt="avatar" width={100}
                               height={100}/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{post.sharedBy} 回复了我的评论</h3>
                        <p className="text-muted-foreground"> {post.title}</p>
                        <p className="text-sm text-muted-foreground"> {post.date}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

