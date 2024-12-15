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

interface Props {
    params: { id: string }
}

export default function CreateEditPost({params}: Props) {
    const router = useRouter()
    const id = params.id
    const [post, setPost] = useState<Post>({id: 0, title: '', content: '', author: '当前用户', date: ''})

    useEffect(() => {
        const fetchPost = async () => {
            const mockPost: Post = {
                id: Number(id),
                title: '绝区零最新更新讨论',
                content: '大家对最新的游戏更新有什么看法？新增的角色平衡性如何？',
                author: '当前用户',
                date: '2023-06-15',
            }
            setPost(mockPost)
        }
        fetchPost()
    }, [id])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, you would send the action data to an API
        console.log('Submitting action:', post)
        router.push('/forum')
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
            <h1 className="text-3xl font-bold mb-8">编辑帖子</h1>
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
                <Button type="submit">保存修改</Button>
            </form>
        </>
    )
}

