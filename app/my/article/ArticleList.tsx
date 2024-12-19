import Empty from "@/components/empty";
import React from "react";
import ArticleItem from "@/app/my/article/ArticleItem";
import {Article} from "@/types";

interface NoteListProps {
    articles: Article[]
}

const ArticleList: React.FC<NoteListProps> = ({articles}) => {
    return (
        <>
            {articles.length ?
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {articles.map((item, index) =>
                        <ArticleItem key={index} article={item}/>)
                    }
                </div> :
                <Empty/>
            }
        </>
    )
}
export default ArticleList