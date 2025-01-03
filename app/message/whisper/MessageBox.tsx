"use client"
import React, {useEffect, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useUser} from "@/contexts/user-context";
import {getSocket} from "@/lib/globalSocket";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Send} from "lucide-react";
import {format} from "date-fns";
import Avatar from "@/components/avatar";

interface Message {
    id: number
    content: string
    senderId: number
    createdAt: Date
}

export default function MessageBox({friend, messageList}) {
    const [messages, setMessages] = useState<Message[]>(messageList)
    const id = useSearchParams().get("id")
    const user = useUser()
    const router = useRouter()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }
    useEffect(() => {
        if (id) {
            router.refresh()
        }
    }, [id]);
    useEffect(() => {
        setMessages(messageList)
    }, [messageList]);

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    async function sendMessage() {
        const response = await fetch("/api/user/friend/message", {
            method: "POST",
            body: JSON.stringify({
                content: inputValue.trim(),
                receiverId: Number(id)
            })
        })
        if (response.ok) {
            setMessages((prev) => [...prev, {
                id: Date.now(),
                content: inputValue,
                senderId: user!.id,
                createdAt: new Date()
            }])
        }
    }

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
                <h3 className="font-semibold h-7">{friend && (friend.nickname || friend.username)}</h3>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex",
                                message.senderId === user?.id ? "justify-end" : "justify-start"
                            )}
                        >
                            {user?.id !== message.senderId &&
                                <Avatar url={friend?.image} className={"mr-2 mt-1"}/>}
                            <div
                                className={cn(
                                    "max-w-[80%] rounded-lg px-4 py-2",
                                    message.senderId === user?.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}
                            >
                                {message.content}
                                <div
                                    className="text-xs mt-1 opacity-70">{format(message.createdAt, 'MM月dd日 HH:mm:ss')}</div>
                            </div>
                            {user?.id === message.senderId &&
                                <Avatar url={user?.image} className={"ml-2 mt-1"}/>}
                        </div>
                    ))}
                    <div ref={messagesEndRef}/>
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
                {id &&
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (!inputValue.trim()) return
                            sendMessage()
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
                }
            </div>
        </div>
    )
}