import { Modal } from "@/components/modal/modal"
import Image from 'next/image'

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
}

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsItem;
}

export function NewsModal({ isOpen, onClose, news }: NewsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={news.title}>
      <div className="space-y-4">
        <Image
          src={news.imageUrl}
          alt={news.title}
          width={600}
          height={400}
          className="w-full h-auto rounded-md"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>作者: {news.author}</span>
          <span>发布日期: {news.date}</span>
        </div>
        <p className="text-foreground">{news.content}</p>
      </div>
    </Modal>
  )
}

