'use client'

import {useEditor, EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from "@/components/tiptap/toolbar";

const Tiptap = ({content, onChange}: { content: string, onChange: any }) => {
    const editor = useEditor({
        extensions: [StarterKit.configure()],
        content: content,
        editorProps: {
            attributes: {
                class: 'p-2 outline-none min-h-[38vh] prose dark:text-white prose-headings:dark:text-white prose-h1:text-3xl prose-h1:font-normal'
            }
        },
        onUpdate({editor}) {
            onChange(editor.getHTML())
        }
    })

    return (
        <div className={'border-2 rounded flex flex-col'}>
            <Toolbar editor={editor}/>
            <EditorContent editor={editor}/>
        </div>
    )
}

export default Tiptap