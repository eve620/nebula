"use client"

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useUser} from "@/contexts/user-context";
import showMessage from "@/components/message";
import {useRouter} from "next/navigation";

export default function NoticePublish() {
    const currentUser = useUser()
    const [time, setTime] = useState("")
    const [title, setTitle] = useState("")
    const [version, setVersion] = useState("")
    const [content, setContent] = useState("")
    const router = useRouter()
    const handleSubmit = async (e) => {
        e.preventDefault()
        const request = await fetch("/api/notice", {
            method: "POST",
            body: JSON.stringify({
                title,
                content,
            })
        })
        if (request.ok) {
            showMessage("添加成功。")
            router.refresh()
        } else {
            showMessage("添加失败。")
        }
    }
    return (
        <>
            {currentUser?.role === "Admin" ? <>
                <form onSubmit={handleSubmit}
                      className="mb-8 p-4 bg-card rounded-lg shadow-lg dark:outline dark:outline-2">
                    <h2 className="text-xl font-semibold mb-4">更新公告</h2>
                    <Input
                        placeholder="日期"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="mb-4"
                    />
                    <Input
                        placeholder="标题"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mb-4"
                    />
                    <Textarea
                        placeholder="版本号"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        className="mb-4"
                    />
                    <Input
                        placeholder="更新内容"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mb-4"
                    />
                    <Button type={"submit"}>发布</Button>
                </form>
            </> : <></>}
        </>
    )
}