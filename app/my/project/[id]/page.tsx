'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { ArrowLeft, Briefcase, Calendar, Code, FileText, Lightbulb, User, Edit } from 'lucide-react'
import { useProject } from "@/contexts/project-context"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"
import { format } from "date-fns"

export default function ProjectDetail() {
    const project = useProject()
    const router = useRouter()
    const { id } = useParams()

    if (!project) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-4">
            <Button
                variant="outline"
                size="sm"
                className="mb-6"
                onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4"/>
                返回
            </Button>

            <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-3xl font-bold">{project.title}</CardTitle>
                    <Button onClick={() => router.push(`/my/project/${id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        编辑项目
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <InfoItem icon={Calendar} label="项目周期" value={`${format(project.startTime, "yyyy年MM月")} - ${project.endTime ? format(project.endTime, "yyyy年MM月") : '至今'}`} />
                            <InfoItem icon={User} label="开发者" value={project.createdBy.nickname || project.createdBy.username} />
                            <InfoItem icon={Briefcase} label="职责" value={project.job} />
                            <InfoItem
                                icon={Code}
                                label="技术栈"
                                value={
                                    <div className="flex flex-wrap gap-2">
                                        {project.stacks.map((tech, index) => (
                                            <span className={'tag'} key={index}>{tech}</span>
                                        ))}
                                    </div>
                                }
                            />
                        </div>
                        <div className="space-y-4">
                            <InfoItem icon={FileText} label="项目描述" value={project.describe} />
                            <InfoItem icon={Lightbulb} label="项目亮点" value={project.highlight} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {project.imageUrl.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">项目展示</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Carousel className="w-full max-w-xl mx-auto">
                            <CarouselContent>
                                {project.imageUrl.map((url, index) => (
                                    <CarouselItem key={index}>
                                        <Card>
                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                <Image src={url} width={300} height={300} alt={`Project image ${index + 1}`} className="rounded-lg object-cover" />
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start space-x-3">
            <Icon className="w-5 h-5 mt-1 text-muted-foreground" />
            <div>
                <h3 className="font-semibold text-lg">{label}</h3>
                <div className="text-sm text-muted-foreground">{value}</div>
            </div>
        </div>
    )
}

