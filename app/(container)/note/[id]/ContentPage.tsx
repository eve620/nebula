"use client"
import {useRouter} from "next/navigation";
import React, {createContext, useState} from "react";
import Viewer from "@/components/tiptap/viewer";
import {Button} from "@/components/ui/button";

interface ContentPageProps {
    note: any
}

const ContentPage: React.FC<ContentPageProps> = ({note}) => {
    const router = useRouter()
    const [tags, setTags] = useState<String[]>(JSON.parse(note.tags))

    async function deleteNote() {
        const deleteNote = await fetch('/api/note', {
            method: "DELETE",
            body: JSON.stringify({
                id: note.id
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
                <Button label={"编辑"} onClick={() => {
                    router.push(`/note/${note.id}/edit`)
                }}/>
                <Button label={"分享"} onClick={() => {
                }}/>
                <Button label={"删除"} onClick={deleteNote}/>
                <Button label={"返回"} onClick={() => {
                    router.push("/note")
                }}/>
            </div>
            <div>
                <Viewer content={note.content}/>
            </div>
        </div>
    )
}

export default ContentPage