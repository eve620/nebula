import {NewsCard} from "@/components/news-card";
import {NoticeModal} from "@/components/modal/notice-modal";
import {useState} from "react";
interface NoticeItem {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
    imageUrl: string;
}
export default function NoticeList({notice}) {
    const [showModal, setShowModal] = useState(false)
    const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null)

    const handleNewsClick = (newsItem: NoticeItem) => {
        setSelectedNotice(newsItem)
        setShowModal(true)
    }
    return (
        <>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
                {notice.map((item) => (
                    <div key={item.id} className="mb-4 break-inside-avoid">
                        <NewsCard news={item} onClick={() => handleNewsClick(item)}/>
                    </div>
                ))}
            </div>
            {/* 公告详情Modal */}
            {selectedNotice && (
                <NoticeModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    notice={selectedNotice}
                />
            )}
        </>
    )
}