'use client'

import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ImageResize from "tiptap-extension-resize-image";
import Toolbar from "@/components/tiptap/toolbar";
import {useEffect} from "react";

export default function RichTextEditor({content, onChange}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: "list-decimal ml-3",
                },
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: "list-disc ml-3",
                },
            }),
            Highlight,
            Image,
            ImageResize,
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'py-4 px-8 leading-8 outline-none min-h-[38vh] prose dark:text-white prose-headings:dark:text-white prose-h1:text-3xl prose-h1:font-normal'
            },
            handlePaste: (view, event) => {
                const items = Array.from(event.clipboardData?.items || [])
                const image = items.find(item => item.type.indexOf('image') === 0)

                if (image) {
                    event.preventDefault()
                    const blob = image.getAsFile()

                    if (blob) {
                        const formData = new FormData()
                        formData.append("image", blob)
                        fetch("/api/article/image", {
                            method: "POST",
                            body: formData as BodyInit,
                        })
                            .then((addImage) => {
                                if (addImage.ok) {
                                    return addImage.json();  // 返回解析后的 JSON 数据
                                }
                                return Promise.reject('上传失败');  // 如果响应不OK，返回一个 rejected promise
                            })
                            .then((res) => {
                                if (typeof res === 'string') {
                                    view.dispatch(view.state.tr.replaceSelectionWith(
                                        view.state.schema.nodes.image.create({src: res})
                                    ));
                                }
                            })
                            .catch((error) => {
                                console.error('图片上传失败:', error);  // 处理错误
                            });
                        // const reader = new FileReader()
                        // reader.onload = (e) => {
                        //     const result = e.target?.result
                        //     if (typeof result === 'string') {
                        //         view.dispatch(view.state.tr.replaceSelectionWith(
                        //             view.state.schema.nodes.image.create({src: result})
                        //         ))
                        //     }
                        // }
                        // reader.readAsDataURL(blob)
                        return true
                    }
                }
                return false
            },
        },
        onUpdate: ({editor}) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && editor.getHTML() !== content) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    return (
        <div className={'border-2 rounded dark:border-slate-600'}>
            <Toolbar editor={editor}/>
            <EditorContent editor={editor}/>
        </div>
    );
}