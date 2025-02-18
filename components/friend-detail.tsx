'use client'

import {Modal} from '@/components/modal/modal'
import Image from 'next/image'

interface Friend {
    id: string;
    username: string;
    nickname: string;
    bio: string;
    image: string;
}

interface FriendDetailProps {
    friend: Friend;
    isOpen: boolean;
    onClose: () => void;
}

export function FriendDetail({friend, isOpen, onClose}: FriendDetailProps) {

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${friend.username}的个人信息`} description={''}>
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
                        <h3 className="text-xl font-semibold">{friend.nickname}</h3>
                        <p className="text-sm text-muted-foreground">{friend.username}</p>
                    </div>
                </div>
                <div>
                    <div className="bg-muted p-2 rounded-lg mb-2">
                        <p>{friend.bio||"这里什么都没有..."}</p>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

