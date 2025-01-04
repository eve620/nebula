"use client"
import React, {useEffect, useState} from "react";
import ArticleList from "@/app/my/article/ArticleList";
import {Article} from "@/types";
import {ArticleSearchBar} from "@/components/article-search-bar";

interface ArticlesProps {
    articles: Article[]
}

const Articles: React.FC<ArticlesProps> = ({articles}) => {
    const [articleList, setArticleList] = useState<Article[]>(articles)
    const [currentTags, setCurrentTags] = useState<string[]>([])
    const [searchKeyword, setSearchKeyword] = useState<string>(''); // 搜索关键字
    
    useEffect(() => {
        const filteredArticles = articles.filter(article =>
            (searchKeyword === '' || article.title.toLowerCase().includes(searchKeyword.toLowerCase())) &&
            (currentTags.length === 0 || currentTags.every(tag => article.tags.includes(tag)))
        );
        setArticleList(filteredArticles);
    }, [searchKeyword, currentTags, articles]);
    return (
        <>
            <ArticleSearchBar searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword}
                              currentTags={currentTags} setCurrentTags={setCurrentTags}/>
            <ArticleList articles={articleList}/>
        </>
    )
}
export default Articles