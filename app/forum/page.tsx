'use client'

import {useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {ForumArticle} from '@/components/forum-article'
import Empty from "@/components/empty";
import React, {useMemo, useState} from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {useArticles} from "@/contexts/articles-context";
import {useUser} from "@/contexts/user-context";
import {ArticleSearchBar} from "@/components/article-search-bar";

export default function Forum() {
    const router = useRouter()
    const articles = useArticles() || []

    const [currentPage, setCurrentPage] = useState(1)
    const postsPerPage = 3
    const user = useUser()

    const [currentTags, setCurrentTags] = useState<string[]>([])
    const [searchKeyword, setSearchKeyword] = useState<string>(''); // 搜索关键字

    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage

    const filterArticles = useMemo(() => {
        setCurrentPage(1)

        return articles.filter(article =>
            (searchKeyword === '' || article.title.toLowerCase().includes(searchKeyword.toLowerCase())) &&
            (currentTags.length === 0 || currentTags.every(tag => article.tags.includes(tag)))
        );
    }, [searchKeyword, currentTags])
    const currentArticles = filterArticles.slice(indexOfFirstPost, indexOfLastPost)
    const totalPages = Math.ceil(filterArticles.length / postsPerPage)

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber)
        }
    }
    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">论坛</h1>
                {user && <Button onClick={() => router.push('/my/article')}>发布文章</Button>}
            </div>
            <ArticleSearchBar searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword}
                              currentTags={currentTags} setCurrentTags={setCurrentTags}/>
            {currentArticles.length ?
                <div className="space-y-6">
                    {currentArticles.map((article) => (
                        <div key={article.id} onClick={() => router.push(`/forum/${article.id}`)}
                             className="cursor-pointer">
                            <ForumArticle article={article}/>
                        </div>
                    ))}
                </div> :
                <Empty/>}
            {filterArticles.length > 0 && (
                <Pagination className={'mt-5'}>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious role="link"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                isActive={currentPage === 1}
                            />
                        </PaginationItem>
                        <>
                            {[...Array(totalPages)].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        onClick={() => handlePageChange(index + 1)}
                                        isActive={currentPage === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                        </>
                        <PaginationItem>
                            <PaginationNext role="link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            isActive={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </>
    )
}

