'use client'

import {useState, useEffect} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Label} from "@/components/ui/label"
import Image from 'next/image'
import {ArrowLeft} from 'lucide-react'

interface NewsItem {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
    imageUrl: string;
    responsibility: string;
    techStack: string;
    highlights: string;
}

export default function NewsDetail() {
    const router = useRouter()
    const {id} = useParams()
    const [news, setNews] = useState<NewsItem | null>(null)

    useEffect(() => {
        // 这里应该是从API获取新闻数据的逻辑
        // 为了演示，我们使用模拟数据
        const mockNews: NewsItem = {
            id: id as string,
            title: '绝区零最新版本更新',
            content: '新版本带来全新角色和任务系统，玩家可以体验更丰富的游戏内容。',
            author: '官方团队',
            date: '2023-06-20',
            imageUrl: '/placeholder.svg',
            responsibility: '版本更新',
            techStack: 'Unity, C#',
            highlights: '新角色, 新任务系统'
        }
        setNews(mockNews)
    }, [id])

    if (!news) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="mb-4"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4"/>
                返回
            </Button>
            <h1 className="text-3xl font-bold mb-8">{news.title}</h1>
            <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">发布日期</Label>
                    <div className="col-span-3">{news.date}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">作者</Label>
                    <div className="col-span-3">{news.author}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">职责</Label>
                    <div className="col-span-3">{news.responsibility}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">技术栈</Label>
                    <div className="col-span-3">{news.techStack}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">描述</Label>
                    <div className="col-span-3">{news.content}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">亮点</Label>
                    <div className="col-span-3">{news.highlights}</div>
                </div>
                <div className="relative w-full h-[400px]">
                    <Image
                        src={news.imageUrl}
                        alt={news.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>
            </div>
        </>
    )
}

