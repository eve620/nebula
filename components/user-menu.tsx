'use client'

import {useState} from 'react'
import Image from 'next/image'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {User as UserIcon, Settings, LogOut, ShieldCheck, UserPlus, MessageSquareText, Calendar} from 'lucide-react'
import {FriendManagementModal} from "@/components/modal/friend-management-modal";
import {DailyCheckInModal} from "@/components/modal/daily-check-in-modal";
import {EditProfileModal} from "@/components/modal/edit-profile-modal";
import {signOut} from "next-auth/react";
import {useUser} from "@/contexts/user-context";
import showMessage from "@/components/message";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function UserMenu() {
    const currentUser = useUser()
    const router = useRouter()
    const [isFriendManagementModalOpen, setIsFriendManagementModalOpen] = useState(false)
    const [isDailyCheckInModalOpen, setIsDailyCheckInModalOpen] = useState(false)
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false); // Add state for EditProfileModal
    const {data: newMessage, error} = useSWR(currentUser ? '/api/check' : null, fetcher, {
        refreshInterval: 5000, // 每5秒轮询一次
    })
    const pathname = usePathname()
    const id = Number(useSearchParams().get("id"))
    if (!newMessage || error) {
        return <div className="w-8 h-8"/>
    }

    const hasNewNotifications = () => {
        return newMessage.hasNewLike ||
            newMessage.hasNewComment ||
            newMessage.hasFriendRequest ||
            (newMessage.unreadSenders.length > 0 &&
                !(pathname === "/message/whisper" &&
                    newMessage.unreadSenders.length === 1 &&
                    newMessage.unreadSenders[0] === id));
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="relative w-8 h-8" aria-expanded={null}>
                        <div
                            className="w-full h-full rounded-full overflow-hidden mr-2 cursor-pointer hover:opacity-80">
                            <Image src={currentUser?.image || '/avatar.png'} alt="avatar" width={100} height={100}/>
                        </div>
                        {hasNewNotifications() && (
                            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{currentUser?.nickname || currentUser?.username}</p> {/* Display nickname if available */}
                            <p className="text-xs leading-none text-muted-foreground">
                                {currentUser?.username}
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
                        <>
                            {newMessage.hasFriendRequest && (
                                <div
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                        </>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/message/whisper')}>
                        <MessageSquareText className="mr-2 h-4 w-4"/>
                        <span>消息</span>
                        <>
                            {(newMessage.hasNewLike || newMessage.unreadSenders.length > 0 || newMessage.hasNewComment) && (
                                <div
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                        </>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsDailyCheckInModalOpen(true)}>
                        <Calendar className="mr-2 h-4 w-4"/>
                        <span>每日打卡</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4"/>
                        <span>设置</span>
                    </DropdownMenuItem>
                    <>
                        {currentUser?.role === "Admin" && (
                            <DropdownMenuItem onClick={() => router.push('/admin')}>
                                <ShieldCheck className="mr-2 h-4 w-4"/>
                                <span>后台管理</span>
                            </DropdownMenuItem>
                        )}
                    </>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => {
                        signOut({redirect: false}).then(() => {
                            router.push("/")
                            router.refresh()
                            showMessage("退出成功！")
                        })
                    }}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        <span>退出登录</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <FriendManagementModal
                isOpen={isFriendManagementModalOpen}
                onClose={() => setIsFriendManagementModalOpen(false)}
            />
            <DailyCheckInModal
                isOpen={isDailyCheckInModalOpen}
                onClose={() => setIsDailyCheckInModalOpen(false)}
            />
            <EditProfileModal
                isOpen={isEditProfileModalOpen}
                onClose={() => setIsEditProfileModalOpen(false)}
            />
        </>
    )
}