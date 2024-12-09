'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ForumPostSummary } from '@/components/forum-post-summary'

export default function Forum() {
  const router = useRouter()
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '绝区零最新更新讨论',
      content: '大家对最新的游戏更新有什么看法？新增的角色平衡性如何？',
      author: '游戏迷小王',
      date: '2023-06-15',
      likes: 42,
      comments: 18,
    },
    {
      id: 2,
      title: '新手求助：如何快速上手？',
      content: '刚开始玩绝区零，有什么快速上手的技巧吗？哪些角色比较适合新手？',
      author: '新人玩家',
      date: '2023-06-14',
      likes: 15,
      comments: 7,
    },
  ])

  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">绝区零论坛</h1>
          <Button onClick={() => router.push('/forum/action?action=new')}>发布新帖子</Button>
        </div>
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} onClick={() => router.push(`/forum/${post.id}`)} className="cursor-pointer">
              <ForumPostSummary post={post} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

