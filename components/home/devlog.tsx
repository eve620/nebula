"use client"
import React, {useRef, useState} from "react";
import {useOnClickOutside} from "next/dist/client/components/react-dev-overlay/internal/hooks/use-on-click-outside";
import {useUser} from "@/contexts/user-context";

interface DevLogProps {
    list: { time: string, content: string }[]
}

const Devlog: React.FC<DevLogProps> = ({list}) => {
    const currentUser = useUser()
    const [isAdd, setIsAdd] = useState(false)
    const addRef = useRef(null)
    const [logList, setLogList] = useState<{ time: string, content: string }[]>(list)

    function getLogList() {
        fetch("/api/devlog").then(res => res.json()).then(data => {
            setLogList(data.data)
        }).catch(err => {
            console.log(err)
        })
    }

    useOnClickOutside(addRef.current, () => {
        if (isAdd) setIsAdd(false)
    })
    const onSubmit = async (data) => {
        const addDevLog = await fetch("/api/devlog", {
            method: "POST",
            body: JSON.stringify(data)
        })
        if (addDevLog.ok) {
            getLogList()
            setIsAdd(false)
        }
    }
    return (
        <div className={"mx-auto max-w-6xl"}>
            <h2 className="text-4xl font-bold mb-12 text-center">开发日志</h2>

            <div className={"flex justify-center flex-wrap"}>
                {logList.map((log, index) => {
                    return (
                        <div key={index} className={"md:w-1/2 lg:w-1/3 xl:w-1/4  scroll-auto p-1 md:p-3"}>
                            <div className="
                                bg-gray-50 border border-gray-200 dark:border-gray-500
                                dark:from-[#525252e6] dark:bg-gradient-to-b dark:to-gray-900
                                rounded-2xl pt-4 pl-4 pb-4
                                hover:shadow-xl dark:shadow-md dark:hover:shadow-blue-700/70
                                ">
                                <div className={"overflow-y-auto pr-2 h-32"}>
                                    <span>{log.time}</span>
                                    <p className={"whitespace-pre-wrap"}>{log.content}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {currentUser?.role === "Admin" &&
                    <div
                        className={`${isAdd ? "md:w-1/2 lg:w-1/3 xl:w-1/4" : "md:w-1/3 lg:w-1/4 xl:w-1/5"} duration-200 scroll-auto p-1 md:p-3`}
                        style={{transitionProperty: "width"}}
                        ref={addRef}>
                        {isAdd ?
                            <div className="
                                bg-gray-50 border border-gray-200 dark:border-gray-500
                                dark:from-[#525252e6] dark:bg-gradient-to-b dark:to-gray-900
                                rounded-2xl pt-4 pl-4 pb-4 relative
                                hover:shadow-xl dark:shadow-md dark:hover:shadow-blue-700/70
                                ">
                                <div className={"overflow-y-auto pr-3 h-32"}>
                                    <input placeholder={"请输入时间"}
                                           className={"w-full bg-transparent border-b outline-none rounded dark:border-b-gray-500 px-1 mb-1"}/>
                                    <textarea placeholder={"请输入内容"}
                                              className={"w-full bg-transparent min-h-12 h-[5.4rem] resize-none border-b outline-none rounded dark:border-b-gray-500 px-1"}/>
                                </div>
                                <div onClick={onSubmit}
                                     className={"absolute h-9 w-9 hover:h-10 hover:w-10 duration-200 bg-fuchsia-300 dark:bg-fuchsia-400 -bottom-3 -right-3 rounded-full flex items-center justify-center"}>
                                    <svg className={"fill-gray-100 dark:fill-black/60"} viewBox="0 0 1024 1024"
                                         version="1.1"
                                         width="22" height="22">
                                        <path
                                            d="M512 832a32 32 0 0 0 32-32v-256h256a32 32 0 0 0 0-64h-256V224a32 32 0 0 0-64 0v256H224a32 32 0 0 0 0 64h256v256a32 32 0 0 0 32 32"></path>
                                    </svg>
                                </div>
                            </div> :
                            <div className="
                                bg-gray-50 border border-gray-200 dark:border-gray-500
                                dark:from-[#525252e6] dark:bg-gradient-to-b dark:to-gray-900
                                rounded-2xl pt-4 pl-4 pb-4
                                hover:shadow-xl dark:shadow-md dark:hover:shadow-blue-700/70
                                " onClick={() => setIsAdd(true)}>
                                <div className={"overflow-y-auto pr-2 h-32"}>
                                    <span>点击添加</span>
                                </div>
                            </div>}
                    </div>
                }
            </div>
        </div>
    )
}

export default Devlog