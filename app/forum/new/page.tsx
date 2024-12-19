'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import Tiptap from "@/components/tiptap/tiptap";
import {useUser} from "@/contexts/user-context";
import showMessage from "@/components/message";

export default function CreateEditPost() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState('')
    const user = useUser()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        const request = await fetch("/api/article", {
            method: "POST",
            body: JSON.stringify({
                title,
                content,
                createdById: user.id
            })
        })
        console.log(await request.json())
        if (request.ok) {
            showMessage("添加成功。")
            router.push("/forum")
            router.refresh()
        } else {
            showMessage("添加失败。")
        }
    }

    function contentChange(value: string) {
        setContent(value)
    }


    return (
        <>
            <h1 className="text-3xl font-bold mb-8"> 发布新帖子</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">标题</label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-1">内容</label>
                    <Tiptap content={content} onChange={contentChange}/>
                </div>
                <div className="flex gap-4 mt-4">
                    <div className={"flex-1"}></div>
                    <Button type={"submit"}>发布</Button>
                    <Button type={"button"} onClick={() => {
                        router.back()
                    }}>取消</Button>
                </div>
            </form>
        </>
    )
}

