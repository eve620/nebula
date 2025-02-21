'use client'

import {useState, useEffect} from 'react'
import {Modal} from "@/components/modal/modal"
import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Friend} from "@/types";
import Avatar from "@/components/avatar";
import {socketClient} from "@/lib/globalSocket";
import {useUser} from "@/contexts/user-context";
import showMessage from "@/components/message";


interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    articleId: number
}

export function ShareModal({isOpen, onClose}: ShareModalProps) {
    const [selectedFriend, setSelectedFriend] = useState<Friend>()
    const [friends, setFriends] = useState<Friend[]>([])
    const user = useUser()
    useEffect(() => {
        if (!isOpen || !user) return
        const fetchFriends = async () => {
            const response = await fetch("/api/user/friend")
            const res = await response.json()
            setFriends(res)
        }
        const socket = socketClient.getSocket()

        socket.emit('login', user.username);

        fetchFriends()

        return () => {
            socket.emit('logout')
            socketClient.close()
        };
    }, [isOpen])

    const handleShare = async () => {
        let url = window.location.href
        if (window.location.pathname.startsWith("/my/article")) {
            url = url.replace("/my/article", "/forum")
        }
        const response = await fetch("/api/user/friend/message", {
            method: "POST",
            body: JSON.stringify({receiverId: selectedFriend.id, content: url, type: "SHARE"})
        })
        if (response.ok) {
            showMessage("分享成功！")
            socketClient.emit("sendMessage", {
                senderUsername: user.username,
                receiverUsername: selectedFriend.username,
                content: url,
                type: "SHARE"
            })
            onClose()
        } else {
            showMessage("分享失败")
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="分享帖子">
            <div className="space-y-4">
                <Select onValueChange={(value) => {
                    const selectedFriend = friends.find(friend => friend.id === value);
                    setSelectedFriend(selectedFriend);  // 根据 id 获取完整的 friend 对象
                }}>
                    <SelectTrigger>
                        <SelectValue placeholder="选择好友">
                            <>
                                {selectedFriend ? (
                                    <div className={'flex items-center'}>
                                        {selectedFriend.username}
                                    </div>
                                ) : (
                                    '选择好友'
                                )}
                            </>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <>
                            {friends.length ? friends.map((friend) => (
                                <SelectItem key={friend.id} value={friend.id}>
                                    <div className={'flex items-center'}>
                                        <Avatar url={friend.image} className={'mr-3'}></Avatar>
                                        <div>{friend.username}</div>
                                    </div>
                                </SelectItem>
                            )) : <div className={"text-center text-muted-foreground"}>暂无好友...</div>}
                        </>
                    </SelectContent>
                </Select>

                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>取消</Button>
                    <Button onClick={handleShare}>分享</Button>
                </div>
            </div>
        </Modal>
    )
}

