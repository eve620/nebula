import { ThumbsUp, MessageSquare } from 'lucide-react'

interface Post {
  id: number
  title: string
  content: string
  author: string
  date: string
  likes: number
  comments: number
}

interface ForumPostSummaryProps {
  post: Post
}

export function ForumPostSummary({ post }: ForumPostSummaryProps) {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-muted-foreground mb-4">
        由 {post.author} 发布于 {post.date}
      </p>
      <p className="mb-4 line-clamp-2">{post.content}</p>
      <div className="flex items-center space-x-4">
        <span className="flex items-center">
          <ThumbsUp className="mr-2 h-4 w-4" />
          {post.likes}
        </span>
        <span className="flex items-center">
          <MessageSquare className="mr-2 h-4 w-4" />
          {post.comments}
        </span>
      </div>
    </div>
  )
}

