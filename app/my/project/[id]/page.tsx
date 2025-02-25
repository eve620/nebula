'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import {ArrowLeft, Briefcase, Calendar, Code, FileText, Lightbulb, User, Edit, Trash2} from 'lucide-react'
import { useProject } from "@/contexts/project-context"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"
import { format } from "date-fns"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import showMessage from "@/components/message";

export default function ProjectDetail() {
    const project = useProject()
    const router = useRouter()
    const { id } = useParams()

    if (!project) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }
    async function deleteProject() {
        const deleteArticle = await fetch('/api/project', {
            method: "DELETE",
            body: JSON.stringify({
                id: project?.id
            })
        })
        if (deleteArticle.ok) {
            router.push('/my/project')
            router.refresh()
            showMessage("删除成功")
        } else {
            showMessage("删除失败")
        }
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
                    <div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button>
                                    <Trash2 className="mr-2 h-4 w-4"/> 删除
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        此操作无法撤消。这将永久删除您的项目，且无法恢复。
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction onClick={deleteProject}>确认删除</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button className={"ml-2"} onClick={() => router.push(`/my/project/${id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <InfoItem icon={Calendar} label="项目周期" value={`${format(project.startTime, "yyyy年MM月")} - ${project.endTime ? format(project.endTime, "yyyy年MM月") : '至今'}`} />
                            <InfoItem icon={User} label="开发者" value={project.createdBy.nickname || project.createdBy.username} />
                            <InfoItem icon={Briefcase} label="职责" value={project.job||"暂无..."} />
                            <InfoItem
                                icon={Code}
                                label="技术栈"
                                value={
                                    <div className="flex flex-wrap gap-2">
                                        {project.stacks.length>0? project.stacks.map((tech, index) => (
                                            <span className={'tag'} key={index}>{tech}</span>
                                        )):"暂无..."}
                                    </div>
                                }
                            />
                        </div>
                        <div className="space-y-4">
                            <InfoItem icon={FileText} label="项目描述" value={project.describe||"暂无..."} />
                            <InfoItem icon={Lightbulb} label="项目亮点" value={project.highlight||"暂无..."} />
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
                                                <Image src={url} width={300} height={300} alt={`项目图片${index + 1}`} className="rounded-lg object-cover" />
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
                <div className="text-sm text-muted-foreground text-wrap">{value}</div>
            </div>
        </div>
    )
}

