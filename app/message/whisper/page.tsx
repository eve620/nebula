'use client'

import React, {useEffect, useState} from "react"
import {Send} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {ScrollArea} from "@/components/ui/scroll-area"
import {cn} from "@/lib/utils"
import {getSocket} from "@/lib/globalSocket";
import {useUser} from "@/contexts/user-context";
import {useSearchParams} from "next/navigation";

interface Message {
    id: string
    content: string
    sender: string
    timestamp: string
}


export default function Page() {
    const [messages, setMessages] = useState<Message[]>([
        {id: '1', content: '你好！', sender: 'user', timestamp: '10:00'},
        {id: '2', content: '有什么可以帮助你的吗？', sender: 'other', timestamp: '10:01'},
    ])
    const id = useSearchParams().get("id")
    useEffect(() => {
        if (id) {
            console.log(id); // 当 `id` 变化时执行操作
        }
    }, [id]);
    const user = useUser()
    const [inputValue, setInputValue] = useState('')
    const socket = getSocket()
    useEffect(() => {
        if (!user) return
        socket.emit('login', user.username);

        socket.on('messageReceived', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => {
            socket.emit('logout');
        };
    }, [user]);
    return (
        <div className="flex-1 flex flex-col">
            {/* Chat Area */}
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
                        <Send className="h-4 w-4"/>
                        <span className="sr-only">发送消息</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}

