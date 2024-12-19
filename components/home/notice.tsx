"use client"
import React, {useRef, useState} from "react";
import {useOnClickOutside} from "next/dist/client/components/react-dev-overlay/internal/hooks/use-on-click-outside";
import {useUser} from "@/contexts/user-context";
import NoticePublish from "@/components/home/notice-publish";
import {Notice} from "@/types";
import {format} from "date-fns";

interface DevLogProps {
    notices: Notice[]
}

const Notice: React.FC<DevLogProps> = ({notices}) => {
    const currentUser = useUser()
    const [isAdd, setIsAdd] = useState(false)
    const addRef = useRef(null)

    useOnClickOutside(addRef.current, () => {
        if (isAdd) setIsAdd(false)
    })

    return (
        <div className={"mx-auto max-w-6xl"}>
            {(notices.length !== 0 || currentUser?.role === 'Admin') &&
                <h2 className="text-4xl font-bold mb-12 text-center">开发日志</h2>}
            {currentUser?.role === 'Admin' && <NoticePublish/>}
            <div className={"flex justify-center flex-wrap"}>
                {notices.map((notice, index) => {
                    return (
                        <div key={index} className={"md:w-1/2 lg:w-1/3 xl:w-1/4  scroll-auto p-1 md:p-3"}>
                            <div className="
                                bg-gray-50 border border-gray-200 dark:border-gray-500
                                dark:from-[#525252e6] dark:bg-gradient-to-b dark:to-gray-900
                                rounded-2xl pt-4 pl-4 pb-4
                                hover:shadow-xl dark:shadow-md dark:hover:shadow-blue-700/70
                                ">
                                <div className={"overflow-y-auto pr-2 h-32"}>
                                    <span>{format(new Date(notice.time), 'yyyy年MM月dd日 HH:mm:ss')}</span>
                                    <p className={"whitespace-pre-wrap"}>{notice.content}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Notice