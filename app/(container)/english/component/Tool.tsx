import React, {useEffect, useRef, useState} from "react";
import {useOnClickOutside} from "next/dist/client/components/react-dev-overlay/internal/hooks/use-on-click-outside";

interface ToolProps {
    currentCourse: {
        title: string;
        statements: { chinese: string; english: string; soundmark: string; }[];
    }
    statementIndex: any,
    handleCourse: (id: string) => void,
    handleWord: (id: number) => void,
}

const Tool: React.FC<ToolProps> = ({currentCourse, statementIndex, handleCourse, handleWord}) => {
    const [showCourseList, setShowCourseList] = useState(false)
    const [showWordList, setShowWordList] = useState(false)
    const [courseList, setCourseList] = useState([])

    const courseRef = useRef<HTMLDivElement | null>(null);
    const statementRef = useRef<HTMLDivElement | null>(null);
    const courseButtonRef = useRef<HTMLDivElement | null>(null);
    const statementButtonRef = useRef<HTMLButtonElement | null>(null);
    const [confirmModalShow, setConfirmModalShow] = useState(false)

    useEffect(() => {
        const getCourseList = async () => {
            const response = await fetch("/api/course/files");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCourseList(data)
        }
        getCourseList()
    }, [])


    useOnClickOutside(courseRef.current, (event) => {
        if (courseButtonRef.current && !courseButtonRef.current.contains(event.target as Node)) {
            setShowCourseList(false)
        }
    })
    useOnClickOutside(statementRef.current, (event) => {
        if (statementButtonRef.current && !statementButtonRef.current.contains(event.target as Node)) {
            setShowWordList(false)
        }
    })

    return (
        <div className={"relative flex justify-between p-4 border-t border-b"}>
            <div className={"flex items-center"}>
                <div ref={courseButtonRef} onClick={() => setShowCourseList(!showCourseList)}
                     className={"cursor-pointer hover:text-blue-500 select-none"}>
                    <svg
                        className="h-7 w-7"
                        viewBox="0 0 24 24"
                    >
                        <g
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                        >
                            <path
                                strokeDasharray="10"
                                strokeDashoffset="10"
                                d="M17 9L20 12L17 15"
                            >
                                <animate
                                    fill="freeze"
                                    attributeName="stroke-dashoffset"
                                    begin="0.6s"
                                    dur="0.2s"
                                    values="10;0"
                                />
                            </path>
                            <path
                                strokeDasharray="16"
                                strokeDashoffset="16"
                                d="M5 5H19"
                            >
                                <animate
                                    fill="freeze"
                                    attributeName="stroke-dashoffset"
                                    dur="0.2s"
                                    values="16;0"
                                />
                            </path>
                            <path
                                strokeDasharray="12"
                                strokeDashoffset="12"
                                d="M5 12H14"
                            >
                                <animate
                                    fill="freeze"
                                    attributeName="stroke-dashoffset"
                                    begin="0.2s"
                                    dur="0.2s"
                                    values="12;0"
                                />
                            </path>
                            <path
                                d="M5 19H19"
                            >
                                <animate
                                    fill="freeze"
                                    attributeName="stroke-dashoffset"
                                    begin="0.4s"
                                    dur="0.2s"
                                    values="16;0"
                                />
                            </path>
                        </g>
                    </svg>
                </div>
                <span className={"mx-4 text-gray-400"}>
                    {currentCourse.title}
                </span>
                <button className={"hover:text-fuchsia-400"} ref={statementButtonRef}
                        onClick={() => setShowWordList(!showWordList)}>
                    {`(${statementIndex + 1 + "/" + currentCourse.statements.length})`}
                </button>
            </div>
            <div className={"flex items-center"}>
                <div onClick={() => setConfirmModalShow(true)}
                     className="link-item mr-4 hover:text-fuchsia-400 cursor-pointer"
                >
                    <svg
                        width="25"
                        height="25"
                        viewBox="0 0 32 32"
                    >
                        <path
                            fill="currentColor"
                            d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6l6-6l-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z"
                        />
                    </svg>
                </div>
                <button>排行榜</button>
            </div>
            <>
                <div
                    ref={courseRef}
                    className={`absolute left-0 top-20 w-80 overflow-x-hidden 
                    overflow-y-auto bg-white border-l-4 shadow select-none 
                    border-blue-800 dark:bg-slate-800 px-2
                    duration-300 rounded-lg
                    ${showCourseList ? 'h-64' : 'h-0'}
                    ${showCourseList ? 'opacity-100' : 'opacity-0'}`}
                    style={{scrollbarWidth: "none"}}>
                    {courseList.sort().map((item, index) => {
                        return (
                            <div
                                className={"flex py-1 border-b whitespace-pre-wrap hover:text-blue-500 cursor-pointer"}
                                onClick={() => {
                                    handleCourse(item)
                                    setShowCourseList(false)
                                }}
                                key={index}>
                                <div className={"font-semibold pl-6"}>Lesson {item}</div>
                            </div>
                        )
                    })}
                </div>
                <div
                    ref={statementRef}
                    className={`absolute left-0 top-20 w-80 overflow-x-hidden 
                    overflow-y-auto bg-white border-l-4 shadow select-none 
                    border-fuchsia-400 dark:bg-slate-800 px-2
                    duration-300 rounded-lg
                    ${showWordList ? 'opacity-100' : 'opacity-0'}
                    ${showWordList ? 'h-64' : 'h-0'}`}
                    style={{scrollbarWidth: "none"}}>
                    {currentCourse.statements.map((item, index) => {
                        return (
                            <div
                                className={"flex py-1 border-b whitespace-pre-wrap hover:text-fuchsia-400 cursor-pointer"}
                                onClick={() => {
                                    handleWord(index)
                                    setShowWordList(false)
                                }}
                                key={index}>
                                <div className={"w-12 text-center"}>{index + 1}</div>
                                <div className={"w-[17rem]"}>{item.chinese}</div>
                            </div>
                        )
                    })}
                </div>
                {/*<Modal isOpen={confirmModalShow}*/}
                {/*       title={"Tips"} little*/}
                {/*       body={(<div className={"ml-5 font-semibold"}>你希望重置进度吗?</div>)}*/}
                {/*       onClose={() => setConfirmModalShow(false)}*/}
                {/*       onSubmit={() => {*/}
                {/*           handleWord(0)*/}
                {/*           setConfirmModalShow(false)*/}
                {/*       }}*/}
                {/*       secondaryAction={() => setConfirmModalShow(false)}*/}
                {/*       secondaryActionLabel={"取消"} actionLabel={"确认"}/>*/}
            </>
        </div>
    )
}
export default Tool