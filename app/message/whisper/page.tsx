'use client'

import React, { useState } from "react"
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Image from "next/image";

interface SharedPost {
    id: string
    title: string
    sharedBy: string
    date: string
}

interface Message {
    id: string
    content: string
    sender: string
    timestamp: string
}

export default function Page() {
    const [sharedPosts] = useState<SharedPost[]>([
        { id: '1', title: '绝区零最新更新讨论', sharedBy: '好友A', date: '2023-06-20' },
        { id: '2', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19' },
        { id: '3', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19' },
        { id: '4', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19' },
        { id: '5', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19' },
        { id: '6', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19' },
        { id: '7', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19' },
        { id: '8', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19' },
        { id: '9', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19' },
        { id: '10', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19' },
        { id: '11', title: '新手求助：如何快速上手？', sharedBy: '好友B', date: '2023-06-19' },
    ])

    const [messages] = useState<Message[]>([
        { id: '1', content: '你好！', sender: 'user', timestamp: '10:00' },
        { id: '2', content: '有什么可以帮助你的吗？', sender: 'other', timestamp: '10:01' },
    ])

    const [inputValue, setInputValue] = useState('')

    return (
        <div className="flex h-[calc(100vh-11rem)] flex-col md:flex-row border rounded-lg overflow-hidden bg-background">
            {/* Contacts List */}
            <div className="w-full md:w-80 border-r">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold">消息列表</h2>
                </div>
                <ScrollArea className="h-[calc(100%-4rem)]">
                    {sharedPosts.map((post) => (
                        <div
                            key={post.id}
                            className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                            <div
                                className={"w-9 mt-2 h-9 bg-blue-300 rounded-full overflow-hidden mr-2"}>
                                <Image src={'/avatar.png'} alt="avatar" width={100}
                                       height={100}/>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h3 className="font-medium leading-none truncate">{post.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{post.sharedBy}</p>
                                <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                <div className="border-b p-4">
                    <h3 className="font-semibold">用户A</h3>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex",
                                    message.sender === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-lg px-4 py-2",
                                        message.sender === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    )}
                                >
                                    {message.content}
                                    <div className="text-xs mt-1 opacity-70">{message.timestamp}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (!inputValue.trim()) return
                            // Handle message send
                            setInputValue('')
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="输入消息..."
                            className="flex-1"
                        />
                        <Button type="submit" size="icon">
                            <Send className="h-4 w-4" />
                            <span className="sr-only">发送消息</span>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

