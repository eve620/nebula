"use client"
import {useNote} from "@/contexts/note-context";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import Viewer from "@/components/tiptap/viewer";
import {useToast} from "@/hooks/use-toast";
import showMessage from "@/components/message";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function Page() {
    const note = useNote()
    const router = useRouter()
    const [tags, setTags] = useState<String[]>(JSON.parse(note?.tags))

    async function deleteNote() {
        const deleteNote = await fetch('/api/note', {
            method: "DELETE",
            body: JSON.stringify({
                id: note?.id
            })
        })
        if (deleteNote.ok) {
            router.push('/note')
            router.refresh()
            showMessage("删除成功")
        } else {
            showMessage("删除失败")
        }
    }

    return (
        <div>
            <div className="flex gap-4 items-center">
                        <span
                            className="flex flex-nowrap text-nowrap text-gray-500 dark:text-gray-300 items-center gap-1.5 break-words text-xl text-muted-foreground sm:gap-2.5">
                            <span className={"cursor-pointer"} onClick={() => {
                                router.push("/note")
                            }}>Home</span><span
                            className={"cursor-default select-none"}>/</span><span>{note.title}</span>
                        </span>
                {tags.length ? tags.map((item, index) => <span key={index}
                                                               className="ml-1 bg-pink-300/20 dark:bg-blue-300/30 px-2 rounded-lg">{item}</span>)
                    : <span className="ml-3">...</span>
                }
                <div className={"flex-1"}></div>
                <Button onClick={() => {
                    router.push(`/my/article/${note?.id}/edit`)
                }}>编辑</Button>
                <Button onClick={() => {
                    showMessage("adsad")
                }}>分享</Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button>删除</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
                            <AlertDialogDescription>
                                此操作无法撤消。这将永久删除您的笔记，且无法恢复。
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteNote}>确认删除</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Button onClick={() => {
                    router.push("/my/article")
                }}>返回</Button>
            </div>
            <div>
                <Viewer content={note?.content || ""}/>
            </div>
        </div>
    )
}