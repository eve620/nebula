'use client'

import {useState} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {User, Settings, LogOut, ShieldCheck, UserPlus, Share2} from 'lucide-react'
import {FriendManagementModal} from './modal/friend-management-modal'
import {ViewSharedPostsModal} from './modal/view-shared-posts-modal'

interface UserMenuProps {
    user: {
        id: string;
        username: string;
        avatarUrl: string;
        isAdmin: boolean;
    };
    onEditProfile: () => void;
    onLogout: () => void;
}

export function UserMenu({user, onEditProfile, onLogout}: UserMenuProps) {
    const router = useRouter()
    const [isFriendManagementModalOpen, setIsFriendManagementModalOpen] = useState(false)
    const [isViewSharedPostsModalOpen, setIsViewSharedPostsModalOpen] = useState(false)

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <div
                        className={"w-8 h-8 bg-blue-300 rounded-full overflow-hidden mr-2 cursor-pointer hover:opacity-80"}>
                        <Image src={'/avatar.jpg'} alt="avatar" width={100} height={100}/>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.username}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.username}@example.com
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={onEditProfile}>
                        <User className="mr-2 h-4 w-4"/>
                        <span>编辑个人资料</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsFriendManagementModalOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4"/>
                        <span>好友管理</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsViewSharedPostsModalOpen(true)}>
                        <Share2 className="mr-2 h-4 w-4"/>
                        <span>查看分享的帖子</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4"/>
                        <span>设置</span>
                    </DropdownMenuItem>
                    {user.isAdmin && (
                        <DropdownMenuItem onClick={() => router.push('/admin')}>
                            <ShieldCheck className="mr-2 h-4 w-4"/>
                            <span>后台管理</span>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={onLogout}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        <span>退出登录</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <FriendManagementModal
                isOpen={isFriendManagementModalOpen}
                onClose={() => setIsFriendManagementModalOpen(false)}
            />
            <ViewSharedPostsModal
                isOpen={isViewSharedPostsModalOpen}
                onClose={() => setIsViewSharedPostsModalOpen(false)}
            />
        </>
    )
}

