'use client'

import {useState} from 'react'
import Image from 'next/image'
import {Button} from "@/components/ui/button"
import {FriendDetail} from "@/components/friend-detail";

interface Friend {
    id: string;
    username: string;
    nickname: string;
    bio: string;
    image: string;
}

interface FriendListProps {
    friends: Friend[];
    onDeleteFriend: (id: string) => void;
}

export function FriendList({friends, onDeleteFriend}: FriendListProps) {
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)

    if (!friends.length) {
        return (
            <div className={"text-muted-foreground text-center"}>无好友...</div>
        )
    }
    const handleDeleteFriend = (id: string) => {
        onDeleteFriend(id);
    }

    return (
        <div className="space-y-2">
            {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Image
                            src={friend.image || "/avatar.png"}
                            alt={friend.nickname || friend.username}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <span>{friend.nickname || friend.username}</span>
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

