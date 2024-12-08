'use client'

import { useState } from 'react'
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  postId: number
}

export function ShareModal({ isOpen, onClose, postId }: ShareModalProps) {
  const [friendName, setFriendName] = useState('')

  const handleShare = () => {
    // In a real app, you would implement the sharing logic here
    console.log(`Sharing post ${postId} with ${friendName}`)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="分享帖子">
      <div className="space-y-4">
        <p>选择要分享的好友：</p>
        <Input
          placeholder="输入好友名称"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleShare}>分享</Button>
        </div>
      </div>
    </Modal>
  )
}

