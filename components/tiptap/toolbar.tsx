'use client'
import {type Editor} from "@tiptap/react";
import {
    Heading1, Heading2, Heading3, Bold, Italic, Strikethrough, List, ListOrdered, Upload,
    Highlighter, AlignCenter, AlignLeft, AlignRight, Code,
} from 'lucide-react'
import {Toggle} from "@/components/ui/toggle";
import {useRef} from "react";

type Props = {
    editor: Editor | null
}
const Toolbar = ({editor}: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    if (!editor) return null
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const formData = new FormData()
            formData.append("image", file)
            const addImage = await fetch("/api/article/image", {
                method: "POST",
                body: formData as BodyInit,
            })
            if (addImage.ok) {
                const res = await addImage.json()
                if (typeof res === 'string') {
                    editor.chain().focus().setImage({src: res}).run()
                }
            }
            // const reader = new FileReader()
            // reader.onload = (e) => {
            //     const result = e.target?.result
            //     if (typeof result === 'string') {
            //         editor.chain().focus().setImage({src: result}).run()
            //     }
            // }
            // reader.readAsDataURL(file)
        }
    }
    const addImage = () => {
        fileInputRef.current?.click()
    };
    return (
        <div className="border-b-2 p-1">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{display: 'none'}}
            />
            <Toggle size={'sm'} title={"H1"}
                    pressed={editor.isActive('heading', {level: 1})}
                    onPressedChange={() => editor?.chain().focus().toggleHeading({level: 1}).run()}>
                <Heading1 className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Heading1>
            </Toggle>
            <Toggle size={'sm'} title={"H2"}
                    pressed={editor.isActive('heading', {level: 2})}
                    onPressedChange={() => editor?.chain().focus().toggleHeading({level: 2}).run()}>
                <Heading2 className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Heading2>
            </Toggle>
            <Toggle size={'sm'} title={"H3"}
                    pressed={editor.isActive('heading', {level: 3})}
                    onPressedChange={() => editor?.chain().focus().toggleHeading({level: 3}).run()}>
                <Heading3 className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Heading3>
            </Toggle>
            <Toggle size={'sm'} title={"粗体"}
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor?.chain().focus().toggleBold().run()}>
                <Bold className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Bold>
            </Toggle>
            <Toggle size={'sm'} title={"斜体"}
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor?.chain().focus().toggleItalic().run()}>
                <Italic className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Italic>
            </Toggle>
            <Toggle size={'sm'} title={"删除线"}
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => editor?.chain().focus().toggleStrike().run()}>
                <Strikethrough className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Strikethrough>
            </Toggle>
            <Toggle size={'sm'} title={"左对齐"}
                    pressed={editor.isActive({textAlign: "left"})}
                    onPressedChange={() => editor?.chain().focus().setTextAlign("left").run()}>
                <AlignLeft className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></AlignLeft>
            </Toggle>
            <Toggle size={'sm'} title={"居中"}
                    pressed={editor.isActive({textAlign: "center"})}
                    onPressedChange={() => editor?.chain().focus().setTextAlign("center").run()}>
                <AlignCenter className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></AlignCenter>
            </Toggle>
            <Toggle size={'sm'} title={"右对齐"}
                    pressed={editor.isActive({textAlign: "right"})}
                    onPressedChange={() => editor?.chain().focus().setTextAlign("right").run()}>
                <AlignRight className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></AlignRight>
            </Toggle>
            <Toggle size={'sm'} title={"无序列表"}
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}>
                <List className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></List>
            </Toggle>
            <Toggle size={'sm'} title={"有序列表"}
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></ListOrdered>
            </Toggle>
            <Toggle size={'sm'} title={"代码块"}
                    pressed={editor.isActive('code')}
                    onPressedChange={() => editor?.chain().focus().toggleCodeBlock().run()}>
                <Code className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Code>
            </Toggle>
            <Toggle size={'sm'} title={"高亮"}
                    pressed={editor.isActive('highlight')}
                    onPressedChange={() => editor?.chain().focus().toggleHighlight().run()}>
                <Highlighter className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Highlighter>
            </Toggle>
            <Toggle size={'sm'} title={"插入图片"}
                    pressed={editor.isActive("image")}
                    onPressedChange={addImage}>
                <Upload className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Upload>
            </Toggle>
        </div>
    )
}

export default Toolbar