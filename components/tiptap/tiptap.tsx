'use client'

import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import ToolBar from "./ToolBar";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ImageResize from "tiptap-extension-resize-image";

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
                class: 'p-2 outline-none min-h-[38vh] prose dark:text-white prose-headings:dark:text-white prose-h1:text-3xl prose-h1:font-normal'
            },
            handlePaste: (view, event) => {
                const items = Array.from(event.clipboardData?.items || [])
                const image = items.find(item => item.type.indexOf('image') === 0)

                if (image) {
                    event.preventDefault()
                    const blob = image.getAsFile()

                    if (blob) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                            const result = e.target?.result
                            if (typeof result === 'string') {
                                view.dispatch(view.state.tr.replaceSelectionWith(
                                    view.state.schema.nodes.image.create({src: result})
                                ))
                            }
                        }
                        reader.readAsDataURL(blob)
                        return true
                    }
                }
                return false
            },
        },
        onUpdate: ({editor}) => {
            console.log(editor.getHTML());
            onChange(editor.getHTML());
        },
    });

    return (
        <div className={'border-2 rounded'}>
            <ToolBar editor={editor}/>
            <EditorContent editor={editor}/>
        </div>
    );
}