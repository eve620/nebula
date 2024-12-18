import {ThumbsUp, MessageSquare} from 'lucide-react'
import {Post} from "@/types";
import {format} from "date-fns";


interface ForumPostProps {
    post: Post
}

export function ForumPost({post}: ForumPostProps) {
    const plainText = post.content.replace(/<\/?[^>]+(>|$)/g, "");
    return (
        <div
            className="bg-card text-card-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-muted-foreground mb-4">
                由 {post.createdBy.nickname || post.createdBy.username} 发布于 {format(new Date(post.createdAt), 'yyyy年MM月dd日 HH:mm:ss')}
            </p>
            <p className="mb-4 text-wrap line-clamp-2 break-words">{plainText}</p>
            <div className="flex items-center space-x-4">
        <span className="flex items-center">
          <ThumbsUp className="mr-2 h-4 w-4"/>
            {post._count.likes}
        </span>
                <span className="flex items-center">
          <MessageSquare className="mr-2 h-4 w-4"/>
                    {post.comments.length}
        </span>
            </div>
        </div>
    )
}

