"use client"
import {useNote} from "@/contexts/note-context";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import Viewer from "@/components/tiptap/viewer";
import {useToast} from "@/hooks/use-toast";
import showMessage from "@/components/Message";

export default function Page() {
    const { toast } = useToast()
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
            //toast
        } else {
            //toast
        }
    }

    return (
        <div>
            <div className="flex gap-4">
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
                    router.push(`/note/${note?.id}/edit`)
                }}>编辑</Button>
                <Button onClick={() => {
                    showMessage("adsad")
                }}>分享</Button>
                <Button onClick={deleteNote}>删除</Button>
                <Button onClick={() => {
                    router.push("/note")
                }}>返回</Button>
            </div>
            <div>
                <Viewer content={note?.content || ""}/>
            </div>
        </div>
    )
}