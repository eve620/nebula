'use client'

import {useRouter} from "next/navigation"
import React, {useRef, useState} from "react"
import {useOnClickOutside} from "next/dist/client/components/react-dev-overlay/internal/hooks/use-on-click-outside"
import Tiptap from "@/components/tiptap/tiptap"
import {Button} from "@/components/ui/button"
import {useTag} from "@/contexts/tag-context"
import {useArticle} from "@/contexts/article-context"
import showMessage from "@/components/message"
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from "@/components/ui/card"
import {Label} from "@/components/ui/label"

export default function Page() {
    const article = useArticle()
    const tags = useTag()
    const router = useRouter()
    const [isTagListShow, setIsTagListShow] = useState(false)
    const tagRef = useRef(null)
    const [title, setTitle] = useState(article?.title)
    const [currentTags, setCurrentTags] = useState<string[]>(JSON.parse(article?.tags || "[]"))
    const [content, setContent] = useState(article?.content)

    function contentChange(value: string) {
        setContent(value)
    }

    async function editArticle() {
        if(!title) {
            showMessage("标题不能为空")
            return
        }
        const editArticle = await fetch("/api/article", {
            method: "PUT",
            body: JSON.stringify({
                id: article?.id,
                title,
                tags: JSON.stringify(currentTags),
                content
            })
        })
        if (editArticle.ok) {
            showMessage("编辑成功！")
            router.push(`/my/article/${article?.id}`)
            router.refresh()
        } else {
            showMessage("编辑失败")
        }
    }

// 一种保留旧标签（已移除标签）的逻辑
// const updateCurrentTags = (tag) => {
//     let newCurrentTags = [...currentTags];
//     const oldTags = currentTags.filter(tag => !tags.includes(tag))
//     if (newCurrentTags.includes(tag)) {
//         newCurrentTags = newCurrentTags.filter(item => item !== tag);
//     } else newCurrentTags.push(tag);
//     newCurrentTags = tags.filter(tag => newCurrentTags.includes(tag));
//     setCurrentTags(oldTags.concat(newCurrentTags));
// };
    const updateCurrentTags = (tag) => {
        let newCurrentTags = [...currentTags];
        if (newCurrentTags.includes(tag)) {
            newCurrentTags = newCurrentTags.filter(item => item !== tag);
        } else newCurrentTags.push(tag);
        newCurrentTags = tags.filter(tag => newCurrentTags.includes(tag));
        setCurrentTags(newCurrentTags);
    };

    useOnClickOutside(tagRef.current, () => {
        setIsTagListShow(false)
    })
    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">编辑文章</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center text-nowrap">标题</Label>
                            <input
                                id="title"
                                placeholder=""
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center text-nowrap">
                                标签
                                <>
                                    {currentTags.length !== 0 && (
                                        <svg
                                            onClick={() => setCurrentTags([])}
                                            className="h-3 w-3 ml-1 cursor-pointer inline-block align-middle"
                                            viewBox="0 0 1024 1024"
                                            fill="currentColor"
                                        >
                                            <path
                                                d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-0.7-8.9-4.9-10.3l-56.7-19.5c-4.1-1.4-8.6 0.7-10.1 4.8-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4-31.6 31.6-68.4 56.4-109.3 73.8-42.3 17.9-87.4 27-133.8 27-46.5 0-91.5-9.1-133.8-27-40.9-17.3-77.7-42.1-109.3-73.8-31.6-31.6-56.4-68.4-73.7-109.4-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4 31.6-31.6 68.4-56.4 109.3-73.8 42.3-17.9 87.4-27 133.8-27 46.5 0 91.5 9.1 133.8 27 40.9 17.3 77.7 42.1 109.3 73.8 9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47c-5.3 4.1-3.5 12.5 3 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l0.8-180.9c-0.1-6.6-7.8-10.3-13-6.2z"/>
                                        </svg>
                                    )}
                                </>
                            </Label>
                            <div className="relative" ref={tagRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsTagListShow(!isTagListShow)}
                                    className="flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                >
                                    <div className="w-11/12 text-left truncate">
                                        {currentTags.length ? (
                                            currentTags.map((item, index) => (
                                                <span key={index}
                                                      className="ml-2 bg-pink-300/20 dark:bg-blue-300/30 px-2 rounded-lg">
                                                        {item}
                                                    </span>
                                            ))
                                        ) : (
                                            <span className="ml-3">...</span>
                                        )}
                                    </div>
                                    <span
                                        className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                                                 fill="currentColor">
                                                <path
                                                    d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z"/>
                                            </svg>
                                        </span>
                                </button>
                                {isTagListShow && (
                                    <ul className="absolute dark:ring-white bg-white dark:bg-slate-900 z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-transparent py-1 text-base shadow-lg dark:shadow-white/10 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                        tabIndex={-1}
                                        role="listbox"
                                    >
                                        {tags.length ? (
                                            tags.map((item: string, index: number) => (
                                                <li
                                                    key={index}
                                                    onClick={() => updateCurrentTags(item)}
                                                    className="relative hover:bg-pink-200/20 dark:hover:bg-blue-300/30 cursor-default select-none py-2 pl-3 pr-9"
                                                >
                                                    <div className="flex items-center">
                                                            <span
                                                                className="ml-3 block truncate font-normal">{item}</span>
                                                    </div>
                                                    {currentTags.includes(item) && (
                                                        <span
                                                            className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                                <svg className="h-5 w-5" viewBox="0 0 20 20"
                                                                     fill="currentColor">
                                                                    <path
                                                                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"/>
                                                                </svg>
                                                            </span>
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="select-none text-center py-2 text-gray-400">无标签...</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>内容</Label>
                        <Tiptap content={content} onChange={contentChange}/>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => router.back()}>
                        取消
                    </Button>
                    <Button onClick={editArticle}>
                        保存
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

