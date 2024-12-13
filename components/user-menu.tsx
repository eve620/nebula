'use client'

import {useState} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {User as UserIcon, Settings, LogOut, ShieldCheck, UserPlus, Share2, Calendar} from 'lucide-react'
import {FriendManagementModal} from "@/components/modal/friend-management-modal";
import {ViewSharedPostsModal} from "@/components/modal/view-shared-posts-modal";
import {DailyCheckInModal} from "@/components/modal/daily-check-in-modal";
import {EditProfileModal} from "@/components/modal/edit-profile-modal";
import {User} from "@/types";

interface UserMenuProps {
    user: User;
    onLogout: () => void;
}

export function UserMenu({user, onLogout}: UserMenuProps) {
    const router = useRouter()
    const [isFriendManagementModalOpen, setIsFriendManagementModalOpen] = useState(false)
    const [isViewSharedPostsModalOpen, setIsViewSharedPostsModalOpen] = useState(false)
    const [isDailyCheckInModalOpen, setIsDailyCheckInModalOpen] = useState(false)
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false); // Add state for EditProfileModal

    const handleEditProfile = (username: string, nickname: string, description: string, avatarUrl: string) => {
        // 这里应该有实际的编辑个人资料逻辑
        console.log('Profile edited:', username, nickname, description, avatarUrl)
        setIsEditProfileModalOpen(false)
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Image
                            src={user.image  || '/storage/avatar/avatar1.jpg'}
                            alt={user.username}
                            className="rounded-full"
                            width={32}
                            height={32}
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.username || user.account}</p> {/* Display nickname if available */}
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.username}@example.com
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => setIsEditProfileModalOpen(true)}> {/* Open EditProfileModal */}
                        <UserIcon className="mr-2 h-4 w-4"/>
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
                    <DropdownMenuItem onClick={() => setIsDailyCheckInModalOpen(true)}>
                        <Calendar className="mr-2 h-4 w-4"/>
                        <span>每日打卡</span>
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
            <DailyCheckInModal
                isOpen={isDailyCheckInModalOpen}
                onClose={() => setIsDailyCheckInModalOpen(false)}
                userId={user.id}
            />
            <EditProfileModal
                isOpen={isEditProfileModalOpen}
                onClose={() => setIsEditProfileModalOpen(false)}
                user ={user}
                onSave={handleEditProfile}
            />
        </>
    )
}