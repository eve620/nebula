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

export function NoticeModal({ isOpen, onClose, notice }: NewsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={notice.title}>
      <div className="space-y-4">
        <Image
          src={notice.imageUrl}
          alt={notice.title}
          width={600}
          height={400}
          className="w-full h-auto rounded-md"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>作者: {notice.author}</span>
          <span>发布日期: {notice.date}</span>
        </div>
        <p className="text-foreground">{notice.content}</p>
      </div>
    </Modal>
  )
}

