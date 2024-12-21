import {ThumbsUp, MessageSquare} from 'lucide-react'
import {format} from "date-fns";
import {Article} from "@/types";


interface ForumArticleProps {
    article: Article
}

export function ForumPost({article}: ForumArticleProps) {
    const plainText = article.content.replace(/<\/?[^>]+(>|$)/g, "");
    return (
        <div
            className="bg-card/60 text-card-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border">
            <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
            <p className="text-muted-foreground mb-4">
                由 {article.createdBy.nickname || article.createdBy.username} 发布于 {format(new Date(article.createdAt), 'yyyy年MM月dd日 HH:mm:ss')}
            </p>
            <p className="mb-4 text-wrap line-clamp-2 break-words">{plainText}</p>
            <div className="flex items-center space-x-4">
        <span className="flex items-center">
          <ThumbsUp className="mr-2 h-4 w-4"/>
            {article._count.likes}
        </span>
                <span className="flex items-center">
          <MessageSquare className="mr-2 h-4 w-4"/>
                    {article.comments.length}
        </span>
            </div>
        </div>
    )
}

