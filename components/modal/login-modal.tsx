'use client'

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Modal} from '@/components/modal/modal'
import {z} from 'zod'
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
}

const loginSchema = z.object({
    username: z.string().min(3, '用户名至少需要3个字符'),
    password: z.string().min(6, '密码至少需要6个字符'),
})

const registerSchema = loginSchema.extend({
    nickname: z.string().min(2, '昵称至少需要2个字符'),
})

export function LoginModal({isOpen, onClose}: LoginModalProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        try {
            if (isRegistering) {
                registerSchema.parse({username, password, nickname})
                // 这里应该有注册逻辑
                const user = await fetch("/api/auth/register", {
                    method: "POST",
                    body: JSON.stringify({})
                })
                if (user.ok) {
                }
            } else {
                loginSchema.parse({username, password})
                // 现有的登录逻辑
                const response: any = await signIn('credentials', {
                    username,
                    password,
                    redirect: false
                })
                if (!response?.error) {
                    setNickname("")
                    setUsername("")
                    setPassword("")
                    router.refresh()
                } else {
                }
            }
            // 为演示目的，我们仍然关闭模态框
            onClose()
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.flatten().fieldErrors)
            }
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isRegistering ? "注册" : "登录"}
               description="输入您的账号信息以访问绝区零的世界。">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username">用户名</Label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="输入用户名"
                        required
                    />
                    {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">密码</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="输入密码"
                        required
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                {isRegistering && (
                    <div className="space-y-2">
                        <Label htmlFor="nickname">昵称</Label>
                        <Input
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="输入昵称"
                            required
                        />
                        {errors.nickname && <p className="text-sm text-red-500">{errors.nickname}</p>}
                    </div>
                )}
                <Button type="submit" className="w-full">{isRegistering ? "注册" : "登录"}</Button>
            </form>
            <div className="mt-4 text-center">
                <button
                    type="button"
                    className="text-sm text-cyan-500 hover:underline"
                    onClick={() => setIsRegistering(!isRegistering)}
                >
                    {isRegistering ? "已有账号？去登录" : "没有账号？去注册"}
                </button>
            </div>
        </Modal>
    )
}

