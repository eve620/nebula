'use client'

import { useState, useEffect } from 'react'
import { Modal } from "@/components/modal/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Friend {
  id: string;
  username: string;
}

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  postId: number
}

export function ShareModal({ isOpen, onClose, postId }: ShareModalProps) {
  const [shareMethod, setShareMethod] = useState<'friend' | 'account'>('friend')
  const [selectedFriend, setSelectedFriend] = useState<string>('')
  const [friendAccount, setFriendAccount] = useState('')
  const [friends, setFriends] = useState<Friend[]>([])

  useEffect(() => {
    // 这里应该有实际的获取好友列表的逻辑
    const fetchFriends = async () => {
      // 模拟API调用
      const mockFriends: Friend[] = [
        { id: '1', username: '好友A' },
        { id: '2', username: '好友B' },
        { id: '3', username: '好友C' },
      ]
      setFriends(mockFriends)
    }

    if (isOpen) {
      fetchFriends()
    }
  }, [isOpen])

  const handleShare = () => {
    if (shareMethod === 'friend') {
      // 分享给选定的好友
      console.log(`Sharing post ${postId} with friend: ${selectedFriend}`)
    } else {
      // 分享给输入的账号
      console.log(`Sharing post ${postId} with account: ${friendAccount}`)
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="分享帖子">
      <div className="space-y-4">
        <Select onValueChange={(value) => setShareMethod(value as 'friend' | 'account')}>
          <SelectTrigger>
            <SelectValue placeholder="选择分享方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="friend">选择好友</SelectItem>
            <SelectItem value="account">输入账号</SelectItem>
          </SelectContent>
        </Select>

        {shareMethod === 'friend' ? (
          <Select onValueChange={setSelectedFriend}>
            <SelectTrigger>
              <SelectValue placeholder="选择好友" />
            </SelectTrigger>
            <SelectContent>
              {friends.map((friend) => (
                <SelectItem key={friend.id} value={friend.id}>{friend.username}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            placeholder="输入好友账号"
            value={friendAccount}
            onChange={(e) => setFriendAccount(e.target.value)}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleShare}>分享</Button>
        </div>
      </div>
    </Modal>
  )
}

