'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { Eye, Trash2, ArrowLeft } from 'lucide-react'
import {Modal} from "@/components/modal/modal";

interface NewsData {
  title: string
  date: string
  responsibility: string
  techStack: string
  description: string
  highlights: string
  images: string[]
}

export default function PublishNews() {
  const router = useRouter()
  const [newsData, setNewsData] = useState<NewsData>({
    title: '',
    date: '',
    responsibility: '',
    techStack: '',
    description: '',
    highlights: '',
    images: [],
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewsData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setNewsData(prev => ({ ...prev, images: [...prev.images, ...newImages] }))
    }
  }

  const handleRemoveImage = (index: number) => {
    setNewsData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Publishing news:', newsData)
    // After publishing, redirect to the news list page
    router.push('/news')
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <Button
            variant="outline"
            size="sm"
            className="mb-4"
            onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        <h1 className="text-3xl font-bold mb-8">新建项目</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">标题</Label>
            <Input id="title" name="title" value={newsData.title} onChange={handleInputChange} required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">时间</Label>
            <Input id="date" name="date" type="date" value={newsData.date} onChange={handleInputChange} required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="responsibility" className="text-right">职责</Label>
            <Input id="responsibility" name="responsibility" value={newsData.responsibility} onChange={handleInputChange} required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="techStack" className="text-right">技术栈</Label>
            <Input id="techStack" name="techStack" value={newsData.techStack} onChange={handleInputChange} required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">描述</Label>
            <Textarea id="description" name="description" value={newsData.description} onChange={handleInputChange} required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="highlights" className="text-right">亮点</Label>
            <Textarea id="highlights" name="highlights" value={newsData.highlights} onChange={handleInputChange} required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">图片</Label>
            <div className="col-span-3">
              <Button type="button" onClick={() => fileInputRef.current?.click()}>
                选择图片
              </Button>
              <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  multiple
              />
            </div>
          </div>
          {newsData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                <div className="col-start-2 col-span-3">
                  <div className="flex gap-4">
                    {newsData.images.map((image, index) => (
                        <div key={index} className="relative w-24 h-24 group">
                          <Image
                              src={image}
                              alt={`Uploaded image ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                              className="rounded"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                type="button"
                                className="text-white p-1 hover:text-blue-400"
                                onClick={() => setPreviewImage(image)}
                            >
                              <Eye size={20} />
                              <span className="sr-only">Preview image</span>
                            </button>
                            <button
                                type="button"
                                className="text-white p-1 hover:text-red-400"
                                onClick={() => handleRemoveImage(index)}
                            >
                              <Trash2 size={20} />
                              <span className="sr-only">Delete image</span>
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button type="submit">发布</Button>
          </div>
        </form>
        {previewImage && (
            <Modal isOpen={!!previewImage} onClose={() => setPreviewImage(null)} title="图片预览">
              <div className="flex justify-center">
                <Image
                    src={previewImage}
                    alt="Preview"
                    width={600}
                    height={400}
                    className="object-contain"
                />
              </div>
            </Modal>
        )}
      </div>
  )
}

