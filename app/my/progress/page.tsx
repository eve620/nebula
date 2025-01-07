"use client"

import React from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"

// 模拟数据
const userData = {
    articleCount: 42,
    streakDays: 30,
    vocabularyProgress: 75,
    projectCount: 7,
    totalWords: 50000,
    averageReadTime: 5
}

export default function ProgressPage() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">文章数量</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userData.articleCount}</div>
                    <p className="text-xs text-muted-foreground">
                        总字数: {userData.totalWords}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">总打卡天数</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userData.streakDays} 天</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">连续打卡</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userData.streakDays} 天</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">单词学习进度</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userData.vocabularyProgress}%</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">项目数量</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userData.projectCount}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">平均阅读时间</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userData.averageReadTime} 分钟</div>
                </CardContent>
            </Card>
        </div>
    )
}

