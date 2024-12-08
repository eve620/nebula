'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from '@/components/modal/modal'
import { FriendList } from '../friend-list'
import { mockWebSocket } from '@/utils/mockWebSocket'

interface Friend {
  id: string;
  username: string;
  avatarUrl: string;
}

interface AddFriendModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [friendAccount, setFriendAccount] = useState('')
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', username: '好友A', avatarUrl: '/placeholder.svg' },
    { id: '2', username: '好友B', avatarUrl: '/placeholder.svg' },
    { id: '3', username: '好友C', avatarUrl: '/placeholder.svg' },
  ])

  const handleSendFriendRequest = () => {
    // 这里应该发送好友请求到服务器
    mockWebSocket.send(JSON.stringify({ type: 'friendRequest', to: friendAccount }));
    console.log('发送好友请求给:', friendAccount);
    setFriendAccount('');
  }

  const handleDeleteFriend = (id: string) => {
    setFriends(friends.filter(friend => friend.id !== id))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="好友管理" description="发送好友请求或管理现有好友。">
      <form onSubmit={(e) => { e.preventDefault(); handleSendFriendRequest(); }} className="space-y-4">
        <div className="space-y-2">
          <Input
            id="friendAccount"
            value={friendAccount}
            onChange={(e) => setFriendAccount(e.target.value)}
            placeholder="输入好友账号"
            required
          />
        </div>
        <Button type="submit" className="w-full">发送好友请求</Button>
      </form>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">好友列表</h3>
        <FriendList friends={friends} onDeleteFriend={handleDeleteFriend} />
      </div>
    </Modal>
  )
}

