"use client"
import {useRouter} from "next/navigation";
import React, {useRef, useState} from "react";
import {useOnClickOutside} from "next/dist/client/components/react-dev-overlay/internal/hooks/use-on-click-outside";
import Tiptap from "@/components/tiptap/tiptap";
import {Button} from "@/components/ui/button";
import {useTag} from "@/contexts/tag-context";
import {useArticle} from "@/contexts/article-context";

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
        <div>
            <div>
                <span
                    className="flex flex-wrap text-gray-500 dark:text-gray-300 items-center gap-1.5 break-words text-2xl text-muted-foreground sm:gap-2.5">
                Edit
                </span>
            </div>
            <div className={"flex mt-4"}>
                <div className={"w-1/2 flex flex-col pr-4"}>
                    <label
                        className={"text-nowrap"}
                    >
                        标题
                    </label>
                    <input
                        placeholder="" value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"}
                    />
                </div>
                <div className={"w-1/2 flex flex-col pl-4"}>
                    <label
                        className={"flex items-center text-nowrap"}
                    >
                        标签
                        {tags.length !== 0 &&
                            <svg onClick={() => setCurrentTags([])}
                                 className="h-4 w-4 ml-2 cursor-pointer inline-block align-middle"
                                 viewBox="0 0 1024 1024" fill="currentColor">
                                <path
                                    d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-0.7-8.9-4.9-10.3l-56.7-19.5c-4.1-1.4-8.6 0.7-10.1 4.8-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4-31.6 31.6-68.4 56.4-109.3 73.8-42.3 17.9-87.4 27-133.8 27-46.5 0-91.5-9.1-133.8-27-40.9-17.3-77.7-42.1-109.3-73.8-31.6-31.6-56.4-68.4-73.7-109.4-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4 31.6-31.6 68.4-56.4 109.3-73.8 42.3-17.9 87.4-27 133.8-27 46.5 0 91.5 9.1 133.8 27 40.9 17.3 77.7 42.1 109.3 73.8 9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47c-5.3 4.1-3.5 12.5 3 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l0.8-180.9c-0.1-6.6-7.8-10.3-13-6.2z"></path>
                            </svg>
                        }
                    </label>
                    <div className="relative" ref={tagRef}>
                        <button onClick={() => setIsTagListShow(!isTagListShow)}
                                className={"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"}>
                            <div className="w-11/12 text-left truncate">
                                {currentTags.length ? currentTags.map((item, index) => <span key={index}
                                                                                             className="ml-2 bg-pink-300/20 dark:bg-blue-300/30 px-2 rounded-lg">{item}</span>)
                                    : <span className="ml-3">...</span>
                                }
                            </div>
                            <span
                                className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                      <path
                                          d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z"/>
                                  </svg>
                              </span>
                        </button>
                        {isTagListShow &&
                            <ul className="absolute dark:ring-white bg-white dark:bg-slate-900 z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-transparent py-1 text-base shadow-lg dark:shadow-white/10 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                tabIndex={-1} role="listbox">
                                {tags.length ? tags.map((item, index) =>
                                        <li key={index} onClick={() => updateCurrentTags(item)}
                                            className="relative hover:bg-pink-200/20 dark:hover:bg-blue-300/30 cursor-default select-none py-2 pl-3 pr-9">
                                            <div className="flex items-center">
                                                <span className="ml-3 block truncate font-normal">{item}</span>
                                            </div>
                                            {currentTags.includes(item) &&
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"/>
                        </svg>
                    </span>}
                                        </li>
                                ) : (
                                    <li className="select-none text-center py-2 text-gray-400">无标签...</li>
                                )}
                            </ul>
                        }
                    </div>
                </div>
            </div>
            <div>
                <div className={"my-2"}>内容</div>
                <Tiptap content={content || ""} onChange={contentChange}/>
            </div>
            <div className="flex gap-4 mt-4">
                <div className={"flex-1"}></div>
                <Button onClick={() => {
                    editArticle()
                    router.push(`/my/article/${article?.id}`)
                    router.refresh()
                }}>保存</Button>
                <Button label={""} onClick={() => {
                    router.back()
                }}>取消</Button>
            </div>
        </div>
    );
}

