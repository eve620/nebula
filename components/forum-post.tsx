'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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

interface ForumPostProps {
  post: Post
}

export function ForumPost({ post }: ForumPostProps) {
  const [likes, setLikes] = useState(post.likes)
  const [comments, setComments] = useState<string[]>([])
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    setLikes(likes + 1)
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      setComments([...comments, newComment])
      setNewComment('')
    }
  }

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-muted-foreground mb-4">
        由 {post.author} 发布于 {post.date}
      </p>
      <p className="mb-4">{post.content}</p>
      <div className="flex items-center space-x-4 mb-4">
        <Button variant="outline" size="sm" onClick={handleLike}>
          <ThumbsUp className="mr-2 h-4 w-4" />
          {likes}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowComments(!showComments)}>
          <MessageSquare className="mr-2 h-4 w-4" />
          {comments.length + post.comments}
        </Button>
      </div>
      {showComments && (
        <div className="mt-4 space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="bg-muted p-3 rounded">
              {comment}
            </div>
          ))}
          <form onSubmit={handleComment} className="space-y-2">
            <Textarea
              placeholder="添加评论..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button type="submit" size="sm">
              发表评论
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

