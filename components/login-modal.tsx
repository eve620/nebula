'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from '@/components/ui/modal'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the login logic
    console.log('Login attempted with:', username, password)
    // For demo purposes, we'll just close the modal
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="登录" description="输入您的账号信息以访问绝区零的世界。">
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
        </div>
        <Button type="submit" className="w-full">登录</Button>
      </form>
      <div className="mt-4 text-center">
        <a href="#" className="text-sm text-cyan-500 hover:underline">忘记密码?</a>
      </div>
    </Modal>
  )
}

