'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import {Menu, X, Sun, Moon} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {UserMenu} from './user-menu'
import {LoginModal} from './modal/login-modal'
import {usePathname} from "next/navigation";
import {User} from "@/types";

const navItems = [
    {name: '首页', href: '/'},
    {name: '角色', href: '/characters'},
    {name: '新闻', href: '/news'},
    {name: '论坛', href: '/forum'},
    {name: '项目', href: '/project'},
    {name: '笔记', href: '/note'},
    {name: '英语', href: '/english'},
    {name: '看板', href: '/kanban'},
]

interface NavbarProps {
    currentUser: User | null;
    curTheme: 'light' | 'dark'
}

export function Navbar({currentUser, curTheme}: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const isActive = (path: string) => {
        return pathname === path
    }
    const [theme, setTheme] = useState<'light' | 'dark'>(curTheme)
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
        if (savedTheme) {
            setTheme(savedTheme)
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        }
    }, [])
    useEffect(() => {
        document.cookie = `theme=${theme}; path=/; max-age=31536000;`
    }, [theme])

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    const handleLogin = (username: string, password: string) => {
        // 这里应该有实际的登录逻辑
        console.log('Login attempted with:', username, password)
        setIsLoginModalOpen(false)
    }

    const handleLogout = () => {
        // 这里应该有实际的登出逻辑
        console.log('User logged out')
    }
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    return (
        <nav className="bg-white dark:bg-slate-900 text-foreground sticky top-0 z-50 shadow-md dark:shadow-slate-800">
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
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                                        isActive(item.href)
                                            ? 'bg-foreground text-primary-foreground'
                                            : 'hover:bg-accent hover:text-accent-foreground'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="ml-4"
                            >
                                {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]"/> :
                                    <Moon className="h-[1.2rem] w-[1.2rem]"/>}
                                <span className="sr-only">切换主题</span>
                            </Button>
                            {currentUser ? (
                                <UserMenu
                                    user={currentUser}
                                    onLogout={handleLogout}
                                />
                            ) : (
                                <Button onClick={() => setIsLoginModalOpen(true)}
                                        className="bg-cyan-500 hover:bg-cyan-600 text-black">
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
                        {currentUser ? (
                            <div className="px-3 py-2">
                                <UserMenu
                                    user={currentUser}
                                    onLogout={handleLogout}
                                />
                            </div>
                        ) : (
                            <Button onClick={() => {
                                setIsOpen(false);
                                setIsLoginModalOpen(true);
                            }} className="w-full mt-2 bg-cyan-500 hover:bg-cyan-600 text-black">
                                立即体验
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleTheme}
                            className="w-full justify-start"
                        >
                            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem] mr-2"/> :
                                <Moon className="h-[1.2rem] w-[1.2rem] mr-2"/>}
                            切换主题
                        </Button>
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${
                                    isActive(item.href)
                                        ? 'bg-foreground text-primary-foreground'
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin}/>
        </nav>
    )
}

