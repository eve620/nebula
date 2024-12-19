'use client'

import {useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {ForumPost} from '@/components/forum-post'
import Empty from "@/components/empty";
import {useMemo, useState} from "react";
import {Input} from "@/components/ui/input"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {useArticles} from "@/contexts/articles-context";

export default function Forum() {
    const router = useRouter()
    const articles = useArticles() || []
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const postsPerPage = 3
    const filteredPosts = useMemo(() => {
        setCurrentPage(1)
        return articles.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [articles, searchTerm])
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber)
        }
    }
    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">论坛</h1>
                <Button onClick={() => router.push('/article/new')}>发布文章</Button>
            </div>
            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="搜索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            {currentPosts.length ?
                <div className="space-y-6">
                    {currentPosts.map((post) => (
                        <div key={post.id} onClick={() => router.push(`/forum/${post.id}`)}
                             className="cursor-pointer">
                            <ForumPost post={post}/>
                        </div>
                    ))}
                </div> :
                <Empty/>}
            {filteredPosts.length > 0 && (
                <Pagination className={'mt-5'}>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
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
                            <PaginationNext
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </>
    )
}

