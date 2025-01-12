"use client"
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useUser} from "@/contexts/user-context";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Send} from "lucide-react";
import {format} from "date-fns";
import Avatar from "@/components/avatar";
import {socketClient} from "@/lib/globalSocket";
import {mutate} from "swr";
import {useRouter} from "next/navigation";

interface Message {
    id: number;
    content: string;
    senderId: number;
    type: "MESSAGE" | "SHARE";
    createdAt: Date;
}

export default function MessageBox({currentId, messageList, friend, more}) {
    const [messages, setMessages] = useState<Message[]>(messageList);
    const [hasMore, setHasMore] = useState(more);
    const user = useUser();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const socket = socketClient.getSocket();
    const [inputValue, setInputValue] = useState("");
    const router = useRouter();
    const previousScrollHeight = useRef(0)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        setHasMore(false);
        mutate("/api/check");
    }, [currentId]);

    useEffect(() => {
        setHasMore(more)
    }, [more]);

    useEffect(() => {
        setMessages(messageList)
    }, [messageList]);

    useEffect(() => {
        if (!user || !socket || !friend) return;

        const handleMessageReceived = ({senderUsername, content, type}) => {
            if (senderUsername !== friend.username) {
                mutate("/api/check");
                return;
            }

            fetch(`/api/user/friend/message?id=${friend.id}`).then(() => {
                mutate("/api/check");
            });

            const newMessage: Message = {
                id: Date.now(),
                content,
                senderId: friend.id,
                createdAt: new Date(),
                type,
            };
            setMessages((prev: Message[]) => [...prev, newMessage]);
        };
        socket.on("messageReceived", handleMessageReceived);
        return () => {
            socket.off("messageReceived", handleMessageReceived);
        };
    }, [user, friend, socket, setMessages]);

    const getMessages = async () => {
        const offset = messages.length;

        const scrollElement = scrollAreaRef.current?.querySelector(
            "[data-radix-scroll-area-viewport]"
        );
        previousScrollHeight.current = scrollElement?.scrollHeight ?? 0; // 记录加载前的总高度
        const response = await fetch(
            `/api/user/friend/message?id=${friend.id}&offset=${offset}`
        );
        if (response.ok) {
            const res = await response.json();
            const {messages, hasMore} = res;
            setMessages((prevMessages) => [...messages.reverse(), ...prevMessages]);
            setHasMore(hasMore);
        }
    };

    useLayoutEffect(() => {
        const scrollElement = scrollAreaRef.current?.querySelector(
            "[data-radix-scroll-area-viewport]"
        );

        if (scrollElement) {
            const newScrollHeight = scrollElement.scrollHeight;
            scrollElement.scrollTop = newScrollHeight - previousScrollHeight.current;
        }
    }, [messages]);


    async function sendMessage() {
        if (!currentId) return;
        const response = await fetch("/api/user/friend/message", {
            method: "POST",
            body: JSON.stringify({
                content: inputValue.trim(),
                receiverId: Number(currentId),
            }),
        });
        if (response.ok) {
            previousScrollHeight.current = 0
            if (socket && friend && user && inputValue.trim()) {
                socket.emit("sendMessage", {
                    senderUsername: user.username,
                    receiverUsername: friend.username,
                    content: inputValue,
                });
            }
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    content: inputValue,
                    senderId: user!.id,
                    createdAt: new Date(),
                    type: "MESSAGE",
                },
            ]);
            setTimeout(() => {
                scrollToBottom()
            }, 0)
        }
    }

    useEffect(() => {
        const scrollElement = scrollAreaRef.current?.querySelector(
            "[data-radix-scroll-area-viewport]"
        );

        if (scrollElement) {
            const handleScroll = (e: Event) => {
                const target = e.target as HTMLDivElement;
                if (target.scrollTop === 0 && hasMore) {
                    const currentScrollHeight = target.scrollHeight;
                    getMessages().then(() => {
                        target.scrollTop = target.scrollHeight - currentScrollHeight;
                    });
                }
            };

            scrollElement.addEventListener("scroll", handleScroll);
            return () => {
                scrollElement.removeEventListener("scroll", handleScroll);
            };
        }
    }, [hasMore]);

    return (
        <div className="flex-1 flex flex-col">
            {/* Chat Area */}
            <div className="border-b p-4">
                <h3 className="font-semibold h-7">
                    {friend && (friend.nickname || friend.username)}
                </h3>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {currentId && !hasMore && <div className={'text-center border-b border-dashed pb-2'}><span
                        className={'text-muted-foreground text-sm'}>没有更多消息了...</span></div>}
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex",
                                message.senderId === user?.id
                                    ? "justify-end"
                                    : "justify-start"
                            )}
                        >
                            {user?.id !== message.senderId && (
                                <Avatar url={friend?.image} className={"mr-2 mt-1"}/>
                            )}
                            <div
                                className={cn(
                                    "max-w-[80%] rounded-lg px-4 py-2",
                                    message.senderId === user?.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}
                            >
                                {message.type && message.type === "SHARE" ? (
                                    <div>
                                        <div className={"font-bold"}>分享了一篇文章</div>
                                        <Button
                                            className={`my-1 ${
                                                message.senderId === user?.id &&
                                                "bg-slate-700 dark:bg-pink-100"
                                            }`}
                                            onClick={() => {
                                                router.push(message.content);
                                            }}
                                        >
                                            点击查看
                                        </Button>
                                    </div>
                                ) : (
                                    message.content
                                )}
                                <div className="text-xs mt-1 opacity-70">
                                    {format(message.createdAt, "MM月dd日 HH:mm:ss")}
                                </div>
                            </div>
                            {user?.id === message.senderId && (
                                <Avatar url={user?.image} className={"ml-2 mt-1"}/>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef}/>
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
                {currentId && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!inputValue.trim()) return;
                            sendMessage();
                            setInputValue("");
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
                )}
            </div>
        </div>
    );
}
