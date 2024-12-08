import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
}

interface NewsCardProps {
  news: NewsItem;
  onClick: () => void;
}

export function NewsCard({ news, onClick }: NewsCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={onClick}>
      <CardHeader>
        <CardTitle>{news.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          src={news.imageUrl}
          alt={news.title}
          width={300}
          height={200}
          className="w-full h-auto mb-4 rounded-md"
        />
        <p className="line-clamp-3">{news.content}</p>
      </CardContent>
    </Card>
  )
}

