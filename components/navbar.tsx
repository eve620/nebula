'use client'

import {useState} from 'react'
import Link from 'next/link'
import {Menu, X} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {UserMenu} from './user-menu'
import ThemeToggle from "@/components/ThemeToggle";
import {LoginModal} from "@/components/login-modal";
import {EditProfileModal} from "@/components/edit-profile-modal";

const navItems = [
    {name: '首页', href: '/'},
    {name: '角色', href: '/characters'},
    {name: '世界', href: '/world'},
    {name: '新闻', href: '/news'},
    {name: '论坛', href: '/forum'},
]

interface NavbarProps {
    currentUser?: any
}

export function Navbar({currentUser}: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [username, setUsername] = useState('用户名')
    const [avatarUrl, setAvatarUrl] = useState('/FF14.png?height=32&width=32')

    const closeLoginModal = () => setIsLoginModalOpen(false)
    const closeEditProfileModal = () => setIsEditProfileModalOpen(false)

    const handleLogin = (username: string, password: string) => {
        // 这里应该有实际的登录逻辑
        setIsLoggedIn(true)
        setUsername(username)
        closeLoginModal()
    }
    const onLoginClick = () => setIsLoginModalOpen(true)
    const onEditProfile = () => setIsEditProfileModalOpen(true)

    const handleSaveProfile = (newUsername: string, newAvatarUrl: string | null) => {
        setUsername(newUsername)
        if (newAvatarUrl) {
            setAvatarUrl(newAvatarUrl)
        }
        closeEditProfileModal()
    }
    const onLogout = () => {
        setIsLoggedIn(false)
        setUsername('用户名')
        setAvatarUrl('/FF14.png?height=32&width=32')
    }
    return (
        <nav className="bg-background text-foreground sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <span className="text-2xl font-bold">绝区零</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition duration-150 ease-in-out"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <ThemeToggle/>
                            {isLoggedIn ? (
                                <UserMenu
                                    username={username}
                                    avatarUrl={avatarUrl}
                                    isAdmin={true}
                                    onEditProfile={onEditProfile}
                                    onLogout={onLogout}
                                />
                            ) : (
                                <Button onClick={onLoginClick} className="bg-cyan-500 hover:bg-cyan-600 text-black">
                                    立即体验
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <span className="sr-only">打开主菜单</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true"/>
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true"/>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground transition duration-150 ease-in-out"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <ThemeToggle/>
                        {isLoggedIn ? (
                            <div className="px-3 py-2">
                                <UserMenu
                                    username={username}
                                    avatarUrl={avatarUrl}
                                    isAdmin={true}
                                    onEditProfile={onEditProfile}
                                    onLogout={onLogout}
                                />
                            </div>
                        ) : (
                            <Button onClick={() => {
                                setIsOpen(false);
                                onLoginClick();
                            }} className="w-full mt-2 bg-cyan-500 hover:bg-cyan-600 text-black">
                                立即体验
                            </Button>
                        )}
                    </div>
                </div>
            )}
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onLogin={handleLogin}/>
            <EditProfileModal
                isOpen={isEditProfileModalOpen}
                onClose={closeEditProfileModal}
                username={username}
                avatarUrl={avatarUrl}
                onSave={handleSaveProfile}
            />
        </nav>
    )
}

