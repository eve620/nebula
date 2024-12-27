'use client'

import {useParams, useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import Image from 'next/image'
import {ArrowLeft, Briefcase, Calendar, Code, FileText, Lightbulb, User} from 'lucide-react'
import {useProject} from "@/contexts/project-context";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {Card, CardContent} from "@/components/ui/card";
import React from "react";
import {format} from "date-fns";

export default function NewsDetail() {
    const project = useProject()
    const router = useRouter()
    const {id} = useParams()
    if (!project) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <Button
                variant="outline"
                size="sm"
                className="mb-4"
                onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4"/>
                返回
            </Button>

            <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <h1 className="text-4xl font-bold mb-4 md:mb-0">{project.title}</h1>
                    <Button onClick={() => router.push(`/my/project/${id}/edit`)}>
                        编辑项目
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <InfoItem icon={Calendar} label="项目周期"
                                  value={`${format(project.startTime, "yyyy年MM月")} - ${project.endTime ? format(project.endTime, "yyyy年MM月") : '至今'}`}/>
                        <InfoItem icon={User} label="开发者"
                                  value={project.createdBy.nickname || project.createdBy.username}/>
                        <InfoItem icon={Briefcase} label="职责" value={project.job}/>
                        <InfoItem icon={Code} label="技术栈" value={
                            <div className="flex flex-wrap gap-2">
                                {project.stacks.map((tech, index) => (
                                    <span className={'tag'} key={index}>{tech}</span>
                                ))}
                            </div>
                        }/>
                    </div>
                    <div className="space-y-6">
                        <InfoItem icon={FileText} label="项目描述" value={project.describe}/>
                        <InfoItem icon={Lightbulb} label="项目亮点" value={project.highlight}/>
                    </div>
                </div>

                {project.imageUrl.length !== 0 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">项目展示</h2>
                        <Carousel className="w-full max-w-xl mx-auto">
                            <CarouselContent>
                                {project.imageUrl.map((_, index) => (
                                        <CarouselItem key={index}>
                                            <div className="p-1">
                                                <Card>
                                                    <CardContent
                                                        className="flex aspect-square items-center justify-center p-6">
                                                        <Image src={project.imageUrl[index]} width={300}
                                                               height={300} alt={"adas"}/>
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
                )}

            </div>
        </div>
    )
}

function InfoItem({icon: Icon, label, value}) {
    return (
        <div className="flex">
            <Icon className="w-5 h-5 mr-3 mt-1"/>
            <div>
                <h3 className="font-semibold text-lg">{label}</h3>
                <div className="text-gray-600 dark:text-gray-400">{value}</div>
            </div>
        </div>
    )
}

