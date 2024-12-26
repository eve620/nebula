"use client"
import React, {useState} from "react";
import './antdModal.css'
import Empty from "@/components/empty";
import {format} from "date-fns/format";
import {useRouter} from "next/navigation";
import {Modal} from "@/components/modal/modal";
import showMessage from "@/components/message";
import Image from "next/image";

const ProjectList: React.FC = ({projectList}) => {
    const [images, setImages] = useState<string[]>([])
    const [imageIndex, setImageIndex] = useState(0)
    const [previewImage, setPreviewImage] = useState(false)
    const [previewTitle, setPreviewTitle] = useState("")
    const router = useRouter()
    const showImages = (images: string[]) => {
        setImages(images)
    }
    return (
        <>
            {projectList.length ?
                <div className="sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-8">
                    {projectList.map(item => {
                        return (
                            <div key={item.id}
                                 onClick={() => {
                                     router.push(`/my/project/${item.id}`)
                                 }}
                                 className="mb-8 sm:break-inside-avoid rounded-xl shadow-lg
                             bg-content transition-shadow dark:hover:shadow-blue-400/40
                             hover:shadow-2xl hover:shadow-purple-400/50">
                                <div className={"flex flex-col p-6"}>
                                    <div className={"flex flex-wrap justify-between text-nowrap"}>
                                <span
                                    className={"font-bold text-black dark:text-white"}>{item.title}</span>
                                        <span className={"text-sm"}>{item.job}</span>
                                    </div>
                                    <div className={"mt-4 w-full"}>
                                        {JSON.parse(item.stacks).map((stack: string, index: number) => {
                                            return (
                                                <span className={"tag mb-3 mr-2 inline-block text-wrap"}
                                                      key={index}>{stack}</span>)
                                        })}
                                    </div>
                                    <div className={""}>
                                        <p>{item.describe}</p>
                                    </div>
                                    <div className={"mt-4"}>
                                        <p>{item.highlight}</p>
                                    </div>
                                    <div className={"my-4"}/>
                                    <div className={"flex justify-between text-xs"}>
                                        <p className={"text-gray-400"}>{(item.startTime && item.startTime) &&
                                            `${format(new Date(item.startTime), "yyyy.MM")} - 
                                            ${format(new Date(item.endTime), "yyyy.MM")}`}</p>
                                        <p className={"text-blue-500 cursor-pointer"} onClick={(e) => {
                                            e.stopPropagation()
                                            if (!JSON.parse(item.imageUrl).length) {
                                                showMessage("无图片")
                                                return
                                            }
                                            setPreviewImage(true)
                                            showImages(JSON.parse(item.imageUrl))
                                            setPreviewTitle(item.title)
                                        }}>展示图片</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div> :
                <Empty/>
            }
            <Modal isOpen={previewImage} autofocus={false} description={previewTitle}
                   onClose={() => {
                setPreviewImage(false)
                setImageIndex(0)
            }} title="图片展示">
                <div className="flex justify-center">
                    <Image
                        src={images[imageIndex]}
                        alt="Preview"
                        width={600}
                        height={400}
                        className="object-contain"
                    />
                </div>
                <div className={"flex justify-between pt-3"}>
                    <button className={"hover:text-fuchsia-400 dark:hover:text-fuchsia-300 dark:text-white"}
                            onClick={() => {
                                if (imageIndex > 0) setImageIndex(imageIndex - 1)
                                else setImageIndex(images.length - 1)
                            }}>
                        <svg
                            width="2em"
                            height="2em"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="m15 5l-6 7l6 7"
                            />
                        </svg>
                    </button>
                    <div className={'space-x-1 flex items-center'}>
                        {images.map((item: string, index: number) => {
                            return (
                                <div onClick={() => {
                                    setImageIndex(index)
                                }}
                                     className={`rounded-full duration-100 hover:bg-fuchsia-300 ${index === imageIndex ? "size-[0.6rem] bg-fuchsia-300" : "size-2 bg-pink-200"} hover:size-[0.6rem] `}
                                     key={index}/>)
                        })}
                    </div>
                    <button className={"hover:text-fuchsia-400 dark:hover:text-fuchsia-300 dark:text-white"}
                            onClick={() => {
                                if (imageIndex < images.length - 1) setImageIndex(imageIndex + 1)
                                else setImageIndex(0)
                            }}>
                        <svg
                            width="2em"
                            height="2em"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="m9 5l6 7l-6 7"
                            />
                        </svg>
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default ProjectList