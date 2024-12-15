'use client'

import {useState, useEffect} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {ArrowLeft} from 'lucide-react'

interface Post {
    id: number
    title: string
    content: string
    author: string
    date: string
}

export default function CreateEditPost() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [post, setPost] = useState<Post>({id: 0, title: '', content: '', author: '当前用户', date: ''})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, you would send the action data to an API
        console.log('Submitting action:', post)
        router.push('/forum')
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="container mx-auto px-4 py-8">
                <Button
                    variant="outline"
                    size="sm"
                    className="mb-4"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    返回
                </Button>
                <h1 className="text-3xl font-bold mb-8"> 发布新帖子</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">标题</label>
                        <Input
                            id="title"
                            value={post.title}
                            onChange={(e) => setPost({...post, title: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium mb-1">内容</label>
                        <Textarea
                            id="content"
                            value={post.content}
                            onChange={(e) => setPost({...post, content: e.target.value})}
                            required
                            rows={10}
                        />
                    </div>
                    <Button type="submit">发布</Button>
                </form>
            </main>
        </div>
    )
}

