"use client"
import React, {useRef, useState} from "react";
import {useOnClickOutside} from "next/dist/client/components/react-dev-overlay/internal/hooks/use-on-click-outside";
import {useUser} from "@/contexts/user-context";
import NoticePublish from "@/components/home/notice-publish";
import {Notice as NoticeType} from "@/types";
import {format} from "date-fns";

interface DevLogProps {
    notices: NoticeType[]
}

const Notice: React.FC<DevLogProps> = ({notices}) => {
    const currentUser = useUser()
    const [isAdd, setIsAdd] = useState(false)
    const addRef = useRef(null)

    useOnClickOutside(addRef.current, () => {
        if (isAdd) setIsAdd(false)
    })

    return (
        <div className="mx-auto max-w-6xl">
            {(notices.length !== 0 || currentUser?.role === "Admin") && (
                <h2 className="text-4xl font-bold mb-12 text-center">更新日志</h2>
            )}
            {currentUser?.role === "Admin" && <NoticePublish/>}
            <div className="flex justify-center flex-wrap">
                {notices.map((notice, index) => (
                    <div key={index} className="md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 md:p-3">
                        <div
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                            rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span
                                    className="text-sm font-semibold text-blue-600 dark:text-blue-400">{notice.version}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {format(new Date(notice.time), "yyyy.MM.dd")}
                                </span>
                            </div>
                            <div
                                className="overflow-y-auto pr-2 h-24">
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {notice.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Notice