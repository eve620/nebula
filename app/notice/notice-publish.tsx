"use client"

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useUser} from "@/contexts/user-context";

export default function NoticePublish() {
    const currentUser = useUser()
    const [newNoticeTitle, setNewNoticeTitle] = useState('')
    const [newNoticeContent, setNewNoticeContent] = useState('')
    const [newNoticeImage, setNewNoticeImage] = useState('')
    return (
        <>
            {currentUser?.role === "Admin" ? <>
                <div className="mb-8 p-4 bg-card rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">发布公告</h2>
                    <Input
                        placeholder="公告标题"
                        value={newNoticeTitle}
                        onChange={(e) => setNewNoticeTitle(e.target.value)}
                        className="mb-4"
                    />
                    <Textarea
                        placeholder="公告内容"
                        value={newNoticeContent}
                        onChange={(e) => setNewNoticeContent(e.target.value)}
                        className="mb-4"
                    />
                    <Input
                        placeholder="图片URL"
                        value={newNoticeImage}
                        onChange={(e) => setNewNoticeImage(e.target.value)}
                        className="mb-4"
                    />
                    <Button>发布公告</Button>
                </div>
            </> : <></>}
        </>
    )
}