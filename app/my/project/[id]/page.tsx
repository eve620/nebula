'use client'

import {useParams, useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import Image from 'next/image'
import {ArrowLeft} from 'lucide-react'
import {useProject} from "@/contexts/project-context";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {Card, CardContent} from "@/components/ui/card";
import React from "react";

interface NewsItem {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
    imageUrl: string;
    responsibility: string;
    techStack: string;
    highlights: string;
}

export default function NewsDetail() {
    const project = useProject()
    const router = useRouter()
    const {id} = useParams()
    if (!project) {
        return <div>Loading...</div>
    }
    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="mb-4"
                onClick={() => router.push("/my/project")}>
                <ArrowLeft className="mr-2 h-4 w-4"/>
                返回
            </Button>
            <div className={'flex justify-between mx-5'}>
                <h1 className="text-3xl font-bold mb-8">{project.title}</h1>
                <Button onClick={() => router.push(`/my/project/${id}/edit`)}>
                    编辑
                </Button>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">发布日期</Label>
                    <div className="col-span-3">{''}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">作者</Label>
                    <div className="col-span-3">{project.createdById}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">职责</Label>
                    <div className="col-span-3">{project.job}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">技术栈</Label>
                    <div className="col-span-3">{JSON.parse(project.stacks)}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">描述</Label>
                    <div className="col-span-3">{project.describe}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">亮点</Label>
                    <div className="col-span-3">{project.highlight}</div>
                </div>
                {JSON.parse(project.imageUrl).length !== 0 && (
                    <div className="relative w-full h-[400px]">
                        <h3 className="text-2xl font-bold mb-4">图片展示</h3>
                        <Carousel className="w-full max-w-xs mx-auto">
                            <CarouselContent>
                                {JSON.parse(project.imageUrl).map((_, index) => (
                                        <CarouselItem key={index}>
                                            <div className="p-1">
                                                <Card>
                                                    <CardContent
                                                        className="flex aspect-square items-center justify-center p-6">
                                                        <Image src={JSON.parse(project.imageUrl)[index]} width={400}
                                                               height={400} alt={"adas"}/>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    )
                                )}
                            </CarouselContent>
                            <CarouselPrevious/>
                            <CarouselNext/>
                        </Carousel>
                    </div>
                )
                }
            </div>
        </>
    )
}

