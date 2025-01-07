import React from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export default async function ProgressPage() {
    const currentUser = await getCurrentUser()
    if (!currentUser) return <div>未登录</div>
    const user = await prisma.user.findUnique({
        where: {id: currentUser.id},
        include: {
            article: true,
            project: true,
            progress: true,
            dailyCheckIn: {
                orderBy: {
                    checkInDate: 'desc'
                }
            },
        },
    })

    if (!user) {
        throw new Error('User not found')
    }

    const articleCount = user.article.length
    const projectCount = user.project.length

    const receivedCommentCount = await prisma.comment.count({
        where: {articleById: currentUser.id},
    })

    const receivedLikeCount = await prisma.like.count({
        where: {articleById: currentUser.id},
    })

    const totalCheckInDays = user.dailyCheckIn.length

    // Calculate consecutive check-in days
    let consecutiveCheckInDays = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < user.dailyCheckIn.length; i++) {
        const checkInDate = new Date(user.dailyCheckIn[i].checkInDate)
        checkInDate.setHours(0, 0, 0, 0)

        const expectedDate = new Date(today)
        expectedDate.setDate(today.getDate() - i)

        if (checkInDate.getTime() === expectedDate.getTime()) {
            consecutiveCheckInDays++
        } else {
            break
        }
    }

    // Get word learning progress
    const wordProgress = user.progress ? {
        course: user.progress.course,
        wordIndex: user.progress.wordIndex
    } : null
    const res = {
        articleCount,
        receivedCommentCount,
        receivedLikeCount,
        totalCheckInDays,
        consecutiveCheckInDays,
        projectCount,
        wordProgress
    }
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">文章数量</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{res.articleCount}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">总打卡天数</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{res.totalCheckInDays} 天</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">连续打卡</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{res.consecutiveCheckInDays} 天</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">单词学习进度</CardTitle>
                </CardHeader>
                <CardContent>
                    {wordProgress ?
                        <div className="text-2xl font-bold">
                            Lesson {res.wordProgress.course} No.{res.wordProgress.wordIndex + 1}</div> :
                        <div className="font-bold">暂未开始学习单词哦~</div>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">项目数量</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{res.projectCount}</div>
                </CardContent>
            </Card>
        </div>
    )
}

