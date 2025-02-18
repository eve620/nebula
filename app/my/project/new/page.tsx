'use client'

import React, {useState, useRef} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Label} from "@/components/ui/label"
import Image from 'next/image'
import {Eye, Trash2, CalendarIcon, Plus} from 'lucide-react'
import {Modal} from "@/components/modal/modal"
import showMessage from "@/components/message"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {cn} from "@/lib/utils"
import {format} from "date-fns"
import {zhCN} from "date-fns/locale"
import {DateRange} from "react-day-picker"
import {Calendar} from "@/components/ui/calendar"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"

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
        if(!title){
            showMessage("标题不能为空")
            return
        }
        if(!job){
            showMessage("职责不能为空")
            return
        }
        if(!describe){
            showMessage("描述不能为空")
            return
        }
        const formData = new FormData()
        formData.append('title', title || "")
        formData.append('job', job || "")
        formData.append('stacks', JSON.stringify(stacks || []))
        formData.append('describe', describe || "")
        formData.append('highlight', highlight || "")
        if (date?.from) {
            formData.append("startTime", date.from.toISOString())
        }
        if (date?.to) {
            formData.append("endTime", date.to.toISOString())
        }
        images.forEach((item) => {
            formData.append('newImages[]', item.sourceFile)
        })
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
        <Card className="w-full max-w-4xl mx-auto min-w-fit">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">新建项目</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="gap-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">标题</Label>
                                <Input id="title" name="title" className={"dark:border-slate-600"} value={title} onChange={(e) => setTitle(e.target.value)}
                                       required/>
                            </div>
                            <div className={"flex flex-col"}>
                                <Label className={'mb-1'}>时间</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-transparent border dark:border-slate-600",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                            <>
                                                {date?.from ? (
                                                    date.to ? (
                                                        <>
                                                            {format(date.from, "yyyy年MM月dd日")} -{" "}
                                                            {format(date.to, "yyyy年MM月dd日")}
                                                        </>
                                                    ) : (
                                                        format(date.from, "yyyy年MM月dd日")
                                                    )
                                                ) : (
                                                    <span>请选择日期...</span>
                                                )}
                                            </>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
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
                            <div>
                                <Label htmlFor="responsibility">职责</Label>
                                <Input id="responsibility" name="responsibility" value={job} className={"dark:border-slate-600"}
                                       onChange={(e) => setJob(e.target.value)} required/>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="techStack">技术栈</Label>
                                {stacks.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {stacks.map((item, index) => {
                                            return <span key={index} onClick={() => {
                                                const newStacks = [...stacks];
                                                newStacks.splice(index, 1);
                                                setStacks(newStacks)
                                            }}
                                                         className={'tag'}>{item}</span>
                                        })}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Input
                                        value={newStack} className={"dark:border-slate-600"}
                                        onChange={(e) => setNewStack(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === " ") {
                                                e.preventDefault();
                                            }
                                        }}
                                        placeholder="输入技术栈..."
                                    />
                                    <Button type="button" onClick={() => {
                                        if (newStack.trim().length === 0) {
                                            showMessage('不能为空');
                                            setNewStack('');
                                            return;
                                        }
                                        setStacks([...stacks, newStack.trim()]);
                                        setNewStack('');
                                    }}>
                                        <Plus className="h-4 w-4 mr-2"/>
                                        添加
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="description">描述</Label>
                                <Textarea id="description" name="description" value={describe} className={"dark:border-slate-600"}
                                          onChange={(e) => setDescribe(e.target.value)} required/>
                            </div>
                            <div>
                                <Label htmlFor="highlights">亮点</Label>
                                <Textarea id="highlights" name="highlights" value={highlight} className={"dark:border-slate-600"}
                                          onChange={(e) => setHighlight(e.target.value)} required/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="image">图片</Label>
                        <div className="flex items-center gap-4 mt-2">
                            <Button type="button" onClick={() => fileInputRef.current?.click()}>
                                选择图片
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                已上传 {images.length}/{maxImages} 张图片
                            </span>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            multiple
                        />
                    </div>
                    {images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {images.map((item, index) => (
                                <div key={index} className="relative w-36 h-36 mx-auto group">
                                    <Image
                                        src={typeof item === "string" ? item : item.url}
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
                                            onClick={() => setPreviewImage(typeof item === "string" ? item : item.url)}
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
                    )}
                </form>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => router.back()}>
                    取消
                </Button>
                <Button onClick={handleSubmit}>发布</Button>
            </CardFooter>
            <>
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
        </Card>
    )
}



