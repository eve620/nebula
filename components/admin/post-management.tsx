'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Post {
  id: number
  title: string
  content: string
  author: string
  date: string
}

export function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, title: "绝区零最新更新讨论", content: "这是一个示例内容", author: "游戏迷小王", date: "2023-06-15" },
    { id: 2, title: "新手求助：如何快速上手？", content: "这是另一个示例内容", author: "新人玩家", date: "2023-06-14" },
  ])

  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' })
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleAddPost = () => {
    setPosts([...posts, { id: posts.length + 1, ...newPost, date: new Date().toISOString().split('T')[0] }])
    setNewPost({ title: '', content: '', author: '' })
  }

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id))
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingPost) {
      setPosts(posts.map(post => post.id === editingPost.id ? editingPost : post))
      setIsEditModalOpen(false)
      setEditingPost(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Input
          placeholder="标题"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <Input
          placeholder="作者"
          value={newPost.author}
          onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
        />
        <Button onClick={handleAddPost}>添加帖子</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标题</TableHead>
            <TableHead>作者</TableHead>
            <TableHead>日期</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>{post.date}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => handleEditPost(post)}>编辑</Button>
                <Button variant="destructive" onClick={() => handleDeletePost(post.id)}>删除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑帖子</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  标题
                </Label>
                <Input
                  id="title"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  内容
                </Label>
                <Textarea
                  id="content"
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">
                  作者
                </Label>
                <Input
                  id="author"
                  value={editingPost.author}
                  onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

