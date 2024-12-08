'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from '@/components/modal/modal'
import { FriendList } from '../friend-list'
import { mockWebSocket } from '@/utils/mockWebSocket'
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Friend {
  id: string;
  username: string;
  avatarUrl: string;
}

interface FriendRequest {
  id: string;
  username: string;
  avatarUrl: string;
}

interface FriendManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FriendManagementModal({ isOpen, onClose }: FriendManagementModalProps) {
  const [friendAccount, setFriendAccount] = useState('')
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', username: '好友A', avatarUrl: '/placeholder.svg' },
    { id: '2', username: '好友B', avatarUrl: '/placeholder.svg' },
    { id: '3', username: '好友C', avatarUrl: '/placeholder.svg' },
  ])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

  useEffect(() => {
    // 监听新的好友请求
    mockWebSocket.on('friendRequest', (data: FriendRequest) => {
      setFriendRequests(prev => [...prev, data]);
    });

    // 在实际应用中，你需要在组件卸载时移除事件监听器
    // return () => {
    //   // 移除事件监听器的逻辑
    // };
  }, []);

  const handleSendFriendRequest = () => {
    // 这里应该发送好友请求到服务器
    mockWebSocket.send(JSON.stringify({ type: 'friendRequest', to: friendAccount }));
    console.log('发送好友请求给:', friendAccount);
    setFriendAccount('');
  }

  const handleDeleteFriend = (id: string) => {
    setFriends(friends.filter(friend => friend.id !== id))
  }

  const handleAcceptRequest = (id: string) => {
    // 这里应该发送接受请求的消息到服务器
    mockWebSocket.send(JSON.stringify({ type: 'acceptFriendRequest', id }));
    const acceptedRequest = friendRequests.find(request => request.id === id);
    if (acceptedRequest) {
      setFriends(prev => [...prev, acceptedRequest]);
    }
    setFriendRequests(requests => requests.filter(request => request.id !== id));
  };

  const handleRejectRequest = (id: string) => {
    // 这里应该发送拒绝请求的消息到服务器
    mockWebSocket.send(JSON.stringify({ type: 'rejectFriendRequest', id }));
    setFriendRequests(requests => requests.filter(request => request.id !== id));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="好友管理" description="管理好友和好友请求">
      <div className="space-y-4">
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

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">好友列表</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {friendRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {friendRequests.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {friendRequests.length === 0 ? (
                <DropdownMenuItem disabled>暂无好友请求</DropdownMenuItem>
              ) : (
                friendRequests.map((request) => (
                  <DropdownMenuItem key={request.id} className="flex items-center justify-between p-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={request.avatarUrl}
                        alt={request.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{request.username}</span>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleAcceptRequest(request.id)}>
                        接受
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleRejectRequest(request.id)}>
                        拒绝
                      </Button>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <FriendList friends={friends} onDeleteFriend={handleDeleteFriend} />
      </div>
    </Modal>
  )
}

