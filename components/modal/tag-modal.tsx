"use client"
import {useEffect, useRef, useState} from "react";
import {X} from "lucide-react";
import {Toggle} from "@/components/ui/toggle";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Modal} from "@/components/modal/modal";
import {Button} from "@/components/ui/button";

interface TagModalProps {
    isOpen: boolean
    onClose: () => void
    tags: string[] | null
}

const TagModal = ({isOpen, onClose, tags}: TagModalProps) => {
    const [currentTags, setCurrentTags] = useState<string[]>(tags);
    const router = useRouter()
    const latestInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (latestInputRef.current) {
            latestInputRef.current.focus();
        }
    }, [currentTags.length]);
    const updateTags = async (newTags: String[]) => {
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
        <Modal
            isOpen={isOpen}
            onClose={() => {
                onClose()
                const uniqueArr = Array.from(new Set(currentTags.filter(Boolean)))
                if (tags.toString() !== uniqueArr.toString()) {
                    updateTags(uniqueArr)
                }
                setCurrentTags(uniqueArr)
            }}
            description="编辑标签。"
            title="标签"
        >
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
        </Modal>
    );
};
export default TagModal