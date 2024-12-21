import {useRouter} from "next/navigation";
import React from "react";
import {Article} from "@/types";

interface NoteItemProps {
    article: Article,
}

const ArticleItem: React.FC<NoteItemProps> = ({article}) => {
    const router = useRouter()
    return (
        <div className="
        cursor-pointer
        select-none
                      outline
                      outline-1
                      dark:outline-transparent
                          text-gray-600
                          dark:text-gray-300
                            py-3
                             mb-8
                             sm:break-inside-avoid
                             rounded-lg
                             text-center
                             text-xl
                             shadow-lg
                             transition-transform
                             dark:bg-gray-700 dark:hover:shadow-slate-800
                             hover:-translate-y-[1.3px]
                             hover:shadow-xl hover:shadow-black/10" onClick={() => {
            router.push(`/my/article/${article.id}`)
        }}>
            {article.title}
        </div>
    )
}

export default ArticleItem