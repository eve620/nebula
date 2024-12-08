'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { FriendDetail } from './friend-detail'
import { mockWebSocket } from '@/utils/mockWebSocket'

interface Friend {
  id: string;
  username: string;
  avatarUrl: string;
}

interface FriendListProps {
  friends: Friend[];
  onDeleteFriend: (id: string) => void;
}

export function FriendList({ friends, onDeleteFriend }: FriendListProps) {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)

  const handleDeleteFriend = (id: string) => {
    // 这里应该发送删除好友的消息到服务器
    mockWebSocket.send(JSON.stringify({ type: 'deleteFriend', id }));
    onDeleteFriend(id);
  }

  return (
    <div className="space-y-2">
      {friends.map((friend) => (
        <div key={friend.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Image
              src={friend.avatarUrl}
              alt={friend.username}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span>{friend.username}</span>
          </div>
          <div>
            <Button variant="outline" size="sm" className="mr-2" onClick={() => setSelectedFriend(friend)}>
              查看
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDeleteFriend(friend.id)}>
              删除
            </Button>
          </div>
        </div>
      ))}
      {selectedFriend && (
        <FriendDetail
          friend={selectedFriend}
          isOpen={!!selectedFriend}
          onClose={() => setSelectedFriend(null)}
        />
      )}
    </div>
  )
}

