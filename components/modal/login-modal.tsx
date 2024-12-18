'use client'

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Modal} from '@/components/modal/modal'
import {z} from 'zod'
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import showMessage from "@/components/message";
import useLoginModal from "@/hooks/use-login-modal";

const loginSchema = z.object({
    username: z.string().min(3, '用户名至少需要3个字符'),
    password: z.string().min(6, '密码至少需要6个字符'),
})

const registerSchema = loginSchema.extend({
    nickname: z.string().min(2, '昵称至少需要2个字符'),
})

export function LoginModal() {
    const loginStore = useLoginModal()
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
                const user = await fetch("/api/auth/user", {
                    method: "POST",
                    body: JSON.stringify({
                        username,
                        password,
                        nickname
                    })
                })
                if (user.ok) {
                    const response = await signIn('credentials', {
                        username,
                        password,
                        redirect: false
                    })
                    if (!response?.error) {
                        showMessage("注册成功！")
                        router.push("/")
                        router.refresh()
                    }
                    setPassword("")
                    setUsername("")
                    setNickname("")
                    setIsRegistering(false)
                } else {
                    const message = await user.json()
                    console.log(message)
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
                    showMessage("登录成功！")
                    router.push("/")
                    router.refresh()
                }
                setNickname("")
                setUsername("")
                setPassword("")
            }
            // 为演示目的，我们仍然关闭模态框
            loginStore.onClose()
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.flatten().fieldErrors)
            }
        }
    }

    return (
        <Modal isOpen={loginStore.isOpen} onClose={loginStore.onClose} title={isRegistering ? "注册" : "登录"}
               description="输入您的账号信息以访问绝区零的世界。">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username">用户名</Label>
                    <Input
                        autoComplete="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="输入用户名"
                        required
                    />
                    {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
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
                <div className="space-y-2">
                    <Label htmlFor="password">密码</Label>
                    <Input
                        autoComplete={'current-password'}
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="输入密码"
                        required
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
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

