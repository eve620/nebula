'use client'

import {Modal} from '@/components/modal/modal'
import Image from 'next/image'

interface Friend {
    id: string;
    username: string;
    nickname: string
    image: string;
}

interface FriendDetailProps {
    friend: Friend;
    isOpen: boolean;
    onClose: () => void;
}

export function FriendDetail({friend, isOpen, onClose}: FriendDetailProps) {
    // 模拟好友发布的内容
    const posts = [
        {id: '1', title: '今天的游戏真好玩！', date: '2023-06-21'},
        {id: '2', title: '新角色太强了，大家一起来玩吧', date: '2023-06-20'},
    ]

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${friend.username}的个人信息`}>
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Image
                        src={friend.image || "/avatar.png"}
                        alt={friend.nickname || friend.username}
                        width={80}
                        height={80}
                        className="rounded-full"
                    />
                    <div>
                        <h3 className="text-xl font-semibold">{friend.nickname || friend.username}</h3>
                        <p className="text-sm text-muted-foreground">ID: {friend.id}</p>
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-2">最近发布</h4>
                    {posts.map((post) => (
                        <div key={post.id} className="bg-muted p-2 rounded-lg mb-2">
                            <p>{post.title}</p>
                            <p className="text-sm text-muted-foreground">{post.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}

