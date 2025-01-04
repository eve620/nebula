'use client'

import {useState, useEffect} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Modal} from '@/components/modal/modal'
import {FriendList} from '../friend-list'
import {Bell} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useUser} from "@/contexts/user-context";
import showMessage from "@/components/message";
import {socketClient} from "@/lib/globalSocket";
import Image from "next/image";

interface Friend {
    id: string;
    nickname: string;
    username: string;
    image: string;
}

interface FriendRequest {
    id: string;
    username: string;
    nickname: string
    image: string;
}

interface FriendManagementModalProps {
    isOpen: boolean
    onClose: () => void
}

export function FriendManagementModal({isOpen, onClose}: FriendManagementModalProps) {
    const [friendAccount, setFriendAccount] = useState('')
    const [friends, setFriends] = useState<Friend[]>([])
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
    const user = useUser()
    const socket = socketClient.getSocket()
    useEffect(() => {
        if (!user || !socket) return
        socket.emit('login', user.username);

        socket.on('friendRequestReceived', () => {
            getFriendRequestList()
            getFriendList()
        });

        socket.on('friendRequestAccepted', () => {
            getFriendRequestList()
            getFriendList()
        });

        return () => {
            socket.emit('logout');
        };
    }, [user, socket]);
    useEffect(() => {
        if (isOpen) {
            getFriendRequestList()
            getFriendList()
        }
    }, [isOpen]);
    const initData = () => {
        getFriendRequestList()
        getFriendList()
    }
    const getFriendRequestList = async () => {
        const response = await fetch("/api/user/friend-request", {
            method: "GET"
        })
        if (response.ok) {
            const data = await response.json()
            setFriendRequests(data)
        }
    }
    const getFriendList = async () => {
        const response = await fetch("/api/user/friend")
        const res = await response.json()
        if (response.ok) {
            setFriends(res)
        }
    }
    const handleSendFriendRequest = async () => {
        const response = await fetch('/api/user/friend-request', {
            method: "POST",
            body: JSON.stringify({receiverUsername: friendAccount})
        });

        const res = await response.json()
        if (response.ok) {
            socket.emit('sendFriendRequest', {
                senderUsername: user?.username,
                receiverUsername: friendAccount
            })
        }
        setFriendAccount('');
        showMessage(res)
    }

    const handleDeleteFriend = async (id: string) => {
        const response = await fetch("/api/user/friend", {
            method: "DELETE",
            body: JSON.stringify({
                friendId: id
            })
        })
        if (response.ok) {
            showMessage("删除成功")
            initData()
        }
    }

    const handleAcceptRequest = async (id: string, username: string) => {
        const response = await fetch("/api/user/friend-request", {
            method: "PUT",
            body: JSON.stringify({
                friendId: id,
            })
        })
        const res = await response.json()
        if (response.ok) {
            initData()
            socket.emit('acceptFriendRequest', {
                receiverUsername: username
            })
            showMessage(res.message)
        } else {
            showMessage(res.error)
        }
    };

    const handleRejectRequest = async (id: string) => {
        const response = await fetch("/api/user/friend-request", {
            method: "DELETE",
            body: JSON.stringify({
                friendId: id,
            })
        })
        const res = await response.json()
        if (response.ok) {
            initData()
            showMessage(res.message)
        } else {
            showMessage(res.error)
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="好友管理" description="管理好友和好友请求">
            <div className="space-y-4">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSendFriendRequest();
                }} className="space-y-4">
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
                                <Bell className="h-4 w-4"/>
                                <>
                                    {friendRequests.length > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                            {friendRequests.length}
                                        </span>
                                    )}
                                </>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <>
                                {friendRequests.length === 0 ? (
                                    <DropdownMenuItem disabled>暂无好友请求</DropdownMenuItem>
                                ) : (
                                    friendRequests.map((request) => (
                                        <DropdownMenuItem key={request.id}
                                                          className="flex items-center justify-between p-2">
                                            <div className="flex items-center space-x-2">
                                                <Image
                                                    src={request.image || "/avatar.png"}
                                                    alt={request.nickname || request.username}
                                                    width={8} height={8}
                                                    className="rounded-full"
                                                />
                                                <span>{request.nickname || request.username}</span>
                                            </div>
                                            <div>
                                                <Button variant="outline" size="sm" className="mr-2"
                                                        onClick={() => handleAcceptRequest(request.id, request.username)}>
                                                    接受
                                                </Button>
                                                <Button variant="destructive" size="sm"
                                                        onClick={() => handleRejectRequest(request.id)}>
                                                    拒绝
                                                </Button>
                                            </div>
                                        </DropdownMenuItem>
                                    ))
                                )}
                            </>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <FriendList friends={friends} onDeleteFriend={handleDeleteFriend}/>
            </div>
        </Modal>
    )
}

