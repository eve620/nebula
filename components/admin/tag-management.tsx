'use client'

import {Input} from "@/components/ui/input";
import {Toggle} from "@/components/ui/toggle";
import {Loader2, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import React, {useEffect, useRef, useState} from "react";
import {toast} from "@/hooks/use-toast";
import showMessage from "@/components/message";

export function TagManagement() {
    const [currentTags, setCurrentTags] = useState([]);
    const latestInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (latestInputRef.current) {
            latestInputRef.current.focus();
        }
    }, [currentTags.length]);

    useEffect(() => {
        fetchTags()
    }, [])

    const fetchTags = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/tag')
            if (!response.ok) {
                throw new Error('获取文章列表失败')
            }
            const data = await response.json()
            setCurrentTags(data)
        } catch {
            toast({
                title: "错误",
                description: "获取标签列表失败",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (index: number, value: string) => {
        setCurrentTags(prevTags => {
            const newTags = [...prevTags];
            newTags[index] = value;
            return newTags;
        });
    }
    const handleDeleteTag = async (item) => {
        const response = await fetch('/api/tag', {
            method: "DELETE",
            body: JSON.stringify(item)
        })
        if (response.ok) {
            fetchTags()
            showMessage("删除成功！")
        } else {
            showMessage("删除失败")
        }
    }

    const handleAdd = () => {
        if (latestInputRef.current && latestInputRef.current.value === '') {
            latestInputRef.current.focus();
            return
        }
        setCurrentTags([...currentTags, '']);
    };
    const handleOnSubmit = async () => {
        const response = await fetch("/api/tag", {
            method: "PUT",
            body: JSON.stringify(currentTags)
        })
        if (response.ok) {
            fetchTags()
            showMessage("保存成功！")
        } else {
            showMessage("保存失败")
        }
    }
    return (
        <>
            {isLoading ?
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-10 h-10 animate-spin text-primary"/>
                </div> : <div className="space-y-4">
                    <div className="space-y-6 pt-2 px-2 pr-4">
                        {currentTags.length ?
                            currentTags.map((item, index) => (
                                <div className={'flex items-center'} key={index}>
                                    <Input value={currentTags[index]}
                                           ref={index === currentTags.length - 1 ? latestInputRef : null}
                                           onChange={(e) => handleInputChange(index, e.target.value)}/>
                                    <Toggle className={"ml-2"} pressed={false} onClick={() => {
                                        handleDeleteTag(item)
                                    }} size={"sm"}>
                                        <X/>
                                    </Toggle>
                                </div>
                            )) :
                            <div className={'flex justify-center items-center h-full'}>暂无标签...</div>}
                    </div>
                    <div className="flex justify-end space-x-3 mr-10">
                        <Button variant={"outline"} onClick={handleAdd}>添加</Button>
                        <Button onClick={handleOnSubmit}>保存</Button>
                    </div>
                </div>}
        </>
    )
}

