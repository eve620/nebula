"use client"

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useUser} from "@/contexts/user-context";
import showMessage from "@/components/message";
import {useRouter} from "next/navigation";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {zhCN} from "date-fns/locale";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {z} from 'zod'

const NoticeSchema = z.object({
    time: z.date({
        required_error: "发布时间是必填的",
        invalid_type_error: "请输入有效的日期",
    }),
    version: z.string()
        .min(1, "版本号是必填的")
        .regex(/^\d+\.\d+\.\d+$/, "版本号格式错误（ex：1.0.0）"),
    title: z.string()
        .min(1, "标题是必填的")
        .max(20, "标题不能超过20个字符"),
    content: z.string()
        .min(1, "内容是必填的")
        .max(200, "内容不能超过200个字符"),
});

export default function NoticePublish() {
    const currentUser = useUser()
    const [time, setTime] = useState<Date | undefined>()
    const [title, setTitle] = useState("")
    const [version, setVersion] = useState("")
    const [content, setContent] = useState("")
    const router = useRouter()
    const handleSubmit = async (e) => {
        e.preventDefault()
        const notice = {
            time,
            version,
            title,
            content,
        }
        try {
            const validatedData = NoticeSchema.parse(notice)
            const request = await fetch("/api/notice", {
                method: "POST",
                body: JSON.stringify(notice)
            })
            if (request.ok) {
                setTime(undefined)
                setTitle("")
                setVersion("")
                setContent("")
                router.refresh()
                showMessage("添加成功。")
            } else {
                showMessage("添加失败。")
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.flatten().fieldErrors
                if (errors.time) showMessage(errors.time)
                else if (errors.title) showMessage(errors.title)
                else if (errors.version) showMessage(errors.version)
                else if (errors.content) showMessage(errors.content)
            }
        }
    }
    return (
        <>
            {currentUser?.role === "Admin" ? <>
                <form onSubmit={handleSubmit}
                      className="mb-8 p-4 bg-card rounded-lg shadow-lg dark:shadow-gray-500">
                    <h2 className="text-xl font-semibold mb-4">更新公告</h2>
                    <Popover>
                        <PopoverTrigger asChild className={'mb-4'}>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full bg-transparent justify-start text-left font-normal",
                                    !time && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon/>
                                <>
                                    {time ? format(time, "yyyy年MM月dd日", {locale: zhCN}) : <span>请选择日期...</span>}
                                </>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="mb-4 p-0 dark:border-neutral-700 dark:bg-slate-950" align="start">
                            <Calendar
                                locale={zhCN}
                                mode="single"
                                selected={time}
                                onSelect={setTime}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Input
                        placeholder="标题"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mb-4"
                    />
                    <Textarea
                        placeholder="版本号"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        className="mb-4"
                    />
                    <Input
                        placeholder="更新内容"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mb-4"
                    />
                    <Button type={"submit"}>发布</Button>
                </form>
            </> : <></>}
        </>
    )
}