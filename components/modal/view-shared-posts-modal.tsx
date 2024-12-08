'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/modal/modal'
import { Button } from '@/components/ui/button'

interface SharedPost {
  id: string;
  title: string;
  sharedBy: string;
  date: string;
}

interface ViewSharedPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ViewSharedPostsModal({ isOpen, onClose }: ViewSharedPostsModalProps) {
  const [sharedPosts, setSharedPosts] = useState<SharedPost[]>([])

  useEffect(() => {
    // 这里应该有实际的获取分享帖子的逻辑
    const fetchSharedPosts = async () => {
      // 模拟API调用
      const mockPosts: SharedPost[] = [
        { id: '1', title: '绝区零最新更新讨论', sharedBy: '好友A', date: '2023-06-20' },
        { id: '2', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19' },
      ]
      setSharedPosts(mockPosts)
    }

    if (isOpen) {
      fetchSharedPosts()
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="查看分享的帖子">
      <div className="space-y-4">
        {sharedPosts.map((post) => (
          <div key={post.id} className="p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground">由 {post.sharedBy} 分享于 {post.date}</p>
            <Button className="mt-2" onClick={() => { /* 跳转到帖子详情页 */ }}>
              查看帖子
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  )
}

