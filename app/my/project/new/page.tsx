'use client'

import {useState, useRef} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Label} from "@/components/ui/label"
import Image from 'next/image'
import {Eye, Trash2, CalendarIcon} from 'lucide-react'
import {Modal} from "@/components/modal/modal";
import showMessage from "@/components/message";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {format} from "date-fns"
import {zhCN} from "date-fns/locale";
import {DateRange} from "react-day-picker"
import {Calendar} from "@/components/ui/calendar"

interface NewsData {
    title: string
    date: string
    responsibility: string
    techStack: string
    description: string
    highlights: string
    images: string[]
}

export default function PublishProject() {
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [job, setJob] = useState("")
    const [date, setDate] = useState<DateRange | undefined>()
    const [stacks, setStacks] = useState([])
    const [describe, setDescribe] = useState("")
    const [highlight, setHighlight] = useState("")
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [newStack, setNewStack] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState([])
    const maxImages = 5
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (images.length + files.length > maxImages) {
            showMessage(`最多上传${maxImages}张图片`)
            return
        }
        if (files) {
            const newImages = Array.from(files).map(file => {
                return {
                    url: URL.createObjectURL(file),
                    sourceFile: file
                }
            })
            setImages([...images, ...newImages])
        }
    }

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', title || "")
        formData.append('job', job || "")
        formData.append('stacks', JSON.stringify(stacks || []))
        formData.append('describe', describe || "")
        formData.append('highlight', highlight || "")
        if (date?.from) {
            formData.append("startTime", date.from.toISOString()); // 开始日期
        }
        if (date?.to) {
            formData.append("endTime", date.to.toISOString()); // 结束日期
        }
        images.forEach((item) => {
            formData.append('newImages[]', item.sourceFile);
        });
        const request = await fetch('/api/project', {
            method: 'POST',
            body: formData as BodyInit
        })

        if (request.ok) {
            showMessage("添加成功！")
            router.push("/my/project")
            router.refresh()
        }
    }

    return (
        <>
            <span
                className="flex flex-wrap text-gray-500 dark:text-gray-300 items-center gap-1.5 break-words text-2xl text-muted-foreground sm:gap-2.5">
                新建项目
            </span>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">标题</Label>
                    <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required
                           className="col-span-3"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">时间</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "col-span-3 h-10 justify-start text-left font-normal bg-transparent border border-gray-300 dark:border-neutral-600",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <>
                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "yyyy年MM月dd日", {locale: zhCN})} -{" "}
                                                {format(date.to, "yyyy年MM月dd日", {locale: zhCN})}
                                            </>
                                        ) : (
                                            format(date.from, "yyyy年MM月dd日", {locale: zhCN})
                                        )
                                    ) : (
                                        <span>请选择日期...</span>
                                    )}
                                </>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 dark:border-neutral-700 dark:bg-slate-950" align="start">
                            <Calendar
                                locale={zhCN}
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="responsibility" className="text-right">职责</Label>
                    <Input id="responsibility" name="responsibility" value={job}
                           onChange={(e) => setJob(e.target.value)}
                           required className="col-span-3"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="techStack" className="text-right">技术栈</Label>
                    <div className="col-span-3">
                        {stacks.length !== 0 &&
                            <div
                                className={'border-neutral-300 flex flex-wrap gap-2 p-2 mb-2 bg-transparent border dark:border-neutral-600 rounded-md outline-none'}>
                                {stacks.map((item, index) => {
                                    return <span key={index} onClick={() => {
                                        const newStacks = [...stacks];
                                        newStacks.splice(index, 1);
                                        setStacks(newStacks)
                                    }}
                                                 className={'tag'}>{item}</span>
                                })}
                            </div>}
                        <div className={'flex gap-3 items-center'}>
                            <Input value={newStack}
                                   onKeyDown={(e) => {
                                       if (e.key === " ") {
                                           e.preventDefault();
                                       }
                                   }}
                                   className={'px-2 py-1 bg-transparent rounded-md outline-none'}
                                   onChange={(e) => setNewStack(e.target.value)}/>
                            <Button type="button" onClick={() => {
                                if (newStack.trim().length === 0) {
                                    showMessage('不能为空')
                                    setNewStack('')
                                    return
                                }
                                console.log(newStack)
                                setStacks([...stacks, newStack.trim()])
                                setNewStack('')
                            }}>添加</Button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">描述</Label>
                    <Textarea id="description" name="description" value={describe}
                              onChange={(e) => setDescribe(e.target.value)}
                              required className="col-span-3"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="highlights" className="text-right">亮点</Label>
                    <Textarea id="highlights" name="highlights" value={highlight}
                              onChange={(e) => setHighlight(e.target.value)}
                              required className="col-span-3"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">图片</Label>
                    <div className="col-span-3">
                        <Button type="button" onClick={() => fileInputRef.current?.click()}>
                            选择图片
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            multiple
                        />
                    </div>
                </div>
                {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-start-2 col-span-3">
                            <div className="flex gap-4">
                                {images.map((item, index) => (
                                    <div key={index} className="relative w-24 h-24 group">
                                        <Image
                                            src={item.url}
                                            alt={`Uploaded image ${index + 1}`}
                                            fill
                                            objectFit="cover"
                                            className="rounded"
                                        />
                                        <div
                                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                type="button"
                                                className="text-white p-1 hover:text-blue-400"
                                                onClick={() => setPreviewImage(item.url)}
                                            >
                                                <Eye size={20}/>
                                                <span className="sr-only">Preview image</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="text-white p-1 hover:text-red-400"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <Trash2 size={20}/>
                                                <span className="sr-only">Delete image</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex gap-4 justify-end mt-4">
                    <div className={"flex-1"}></div>
                    <Button type={"submit"}>发布</Button>
                    <Button type={"button"} onClick={() => {
                        router.back()
                    }}>取消</Button>
                </div>
            </form>
            {previewImage && (
                <Modal isOpen={!!previewImage} onClose={() => setPreviewImage(null)} title="图片预览">
                    <div className="flex justify-center">
                        <Image
                            src={previewImage}
                            alt="Preview"
                            width={600}
                            height={400}
                            className="object-contain"
                        />
                    </div>
                </Modal>
            )}
        </>
    )
}

