'use client'

import {Input} from "@/components/ui/input";
import {Toggle} from "@/components/ui/toggle";
import {X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "@/hooks/use-toast";

export function TagManagement() {
    const [currentTags, setCurrentTags] = useState<string[]>([]);
    const router = useRouter()
    const latestInputRef = useRef<HTMLInputElement>(null);

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
            const response = await fetch('/api/tag')
            if (!response.ok) {
                throw new Error('获取文章列表失败')
            }
            const data = await response.json()
            setCurrentTags(JSON.parse(data.tags))
        } catch (error) {
            toast({
                title: "错误",
                description: "获取标签列表失败",
                variant: "destructive",
            })
        }
    }

    const updateTags = async (newTags: string[]) => {
        const update = await fetch('/api/tag', {
            method: "PUT",
            body: JSON.stringify(newTags)
        })
        if (update.ok) {
            //toast
            router.refresh()
        } else {
            //toast
        }
    }

    const handleInputChange = (index: number, value: string) => {
        setCurrentTags(prevTags => {
            const newTags = [...prevTags];
            newTags[index] = value;
            return newTags;
        });
    }
    const handleDeleteTag = (index: number) => {
        setCurrentTags(prevTags => {
            const newTags = [...prevTags];
            newTags.splice(index, 1);
            return newTags;
        });
    }

    const handleOnSubmit = () => {
        setCurrentTags([...currentTags, '']);
    };
    return (
        <div className="space-y-4">
            <div className="space-y-6 h-96 pt-2 px-2 overflow-y-auto pr-4">
                {currentTags.length ?
                    currentTags.map((item, index) => (
                        <div className={'flex items-center'} key={index}>
                            <Input value={currentTags[index]}
                                   ref={index === currentTags.length - 1 ? latestInputRef : null}
                                   onChange={(e) => handleInputChange(index, e.target.value)}/>
                            <Toggle pressed={false} onClick={() => {
                                handleDeleteTag(index)
                            }} size={"sm"}>
                                <X/>
                            </Toggle>
                        </div>
                    )) :
                    <div className={'flex justify-center items-center h-full'}>暂无标签...</div>}
            </div>
            <Button onClick={handleOnSubmit}>添加</Button>
        </div>
    )
}

