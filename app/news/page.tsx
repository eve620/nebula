'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { NewsCard } from '@/components/news-card'
import { NewsModal } from '@/components/modal/news-modal'

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: '绝区零最新版本更新',
      content: '新版本带来全新角色和任务系统，玩家可以体验更丰富的游戏内容。',
      author: '官方团队',
      date: '2023-06-20',
      imageUrl: '/placeholder.svg'
    },
    {
      id: '2',
      title: '年度电竞赛事即将开启',
      content: '年度绝区零电竞赛事将于下月举行，顶尖玩家将展开激烈对决。',
      author: '赛事组委会',
      date: '2023-06-18',
      imageUrl: '/placeholder.svg'
    },
  ])
  const [showModal, setShowModal] = useState(false)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [newNewsTitle, setNewNewsTitle] = useState('')
  const [newNewsContent, setNewNewsContent] = useState('')
  const [newNewsImage, setNewNewsImage] = useState('')

  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem)
    setShowModal(true)
  }

  const handleAddNews = () => {
    const newNews: NewsItem = {
      id: (news.length + 1).toString(),
      title: newNewsTitle,
      content: newNewsContent,
      author: '当前用户', // 这里应该使用实际的用户名
      date: new Date().toISOString().split('T')[0],
      imageUrl: newNewsImage || '/placeholder.svg'
    }
    setNews([newNews, ...news])
    setNewNewsTitle('')
    setNewNewsContent('')
    setNewNewsImage('')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">新闻</h1>
        
        {/* 发布新闻表单 */}
        <div className="mb-8 p-4 bg-card rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">发布新闻</h2>
          <Input
            placeholder="新闻标题"
            value={newNewsTitle}
            onChange={(e) => setNewNewsTitle(e.target.value)}
            className="mb-4"
          />
          <Textarea
            placeholder="新闻内容"
            value={newNewsContent}
            onChange={(e) => setNewNewsContent(e.target.value)}
            className="mb-4"
          />
          <Input
            placeholder="图片URL"
            value={newNewsImage}
            onChange={(e) => setNewNewsImage(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleAddNews}>发布新闻</Button>
        </div>

        {/* 新闻列表 */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
          {news.map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid">
              <NewsCard news={item} onClick={() => handleNewsClick(item)} />
            </div>
          ))}
        </div>
      </main>

      {/* 新闻详情Modal */}
      {selectedNews && (
        <NewsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          news={selectedNews}
        />
      )}
    </div>
  )
}

