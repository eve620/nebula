'use client'
import {type Editor} from "@tiptap/react";
import {Heading1, Heading2, Heading3, Bold, Italic, Strikethrough, List, ListOrdered} from 'lucide-react'
import {Toggle} from "@/components/ui/toggle";

type Props = {
    editor: Editor | null
}
const ToolBar = ({editor}: Props) => {
    if (!editor) {
        return null
    }

    return (
        <div className="border-b-2 p-1">
            <Toggle size={'sm'}
                    pressed={editor.isActive('heading', {level: 1})}
                    onPressedChange={() => editor?.chain().focus().toggleHeading({level: 1}).run()}>
                <Heading1 className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Heading1>
            </Toggle>
            <Toggle size={'sm'}
                    pressed={editor.isActive('heading', {level: 2})}
                    onPressedChange={() => editor?.chain().focus().toggleHeading({level: 2}).run()}>
                <Heading2 className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Heading2>
            </Toggle>
            <Toggle size={'sm'}
                    pressed={editor.isActive('heading', {level: 3})}
                    onPressedChange={() => editor?.chain().focus().toggleHeading({level: 3}).run()}>
                <Heading3 className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Heading3>
            </Toggle>
            <Toggle size={'sm'}
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor?.chain().focus().toggleBold().run()}>
                <Bold className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Bold>
            </Toggle>
            <Toggle size={'sm'}
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor?.chain().focus().toggleItalic().run()}>
                <Italic className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Italic>
            </Toggle>
            <Toggle size={'sm'}
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => editor?.chain().focus().toggleStrike().run()}>
                <Strikethrough className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></Strikethrough>
            </Toggle>
            <Toggle size={'sm'}
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}>
                <List className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></List>
            </Toggle>
            <Toggle size={'sm'}
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className={'text-neutral-600 dark:text-gray-200 h-5 w-5'}></ListOrdered>
            </Toggle>
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleBold().run()}*/}
            {/*    disabled={*/}
            {/*        !editor.can()*/}
            {/*            .chain()*/}
            {/*            .focus()*/}
            {/*            .toggleBold()*/}
            {/*            .run()*/}
            {/*    }*/}
            {/*    className={editor.isActive('bold') ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    Bold*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleItalic().run()}*/}
            {/*    disabled={*/}
            {/*        !editor.can()*/}
            {/*            .chain()*/}
            {/*            .focus()*/}
            {/*            .toggleItalic()*/}
            {/*            .run()*/}
            {/*    }*/}
            {/*    className={editor.isActive('italic') ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    Italic*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleStrike().run()}*/}
            {/*    disabled={*/}
            {/*        !editor.can()*/}
            {/*            .chain()*/}
            {/*            .focus()*/}
            {/*            .toggleStrike()*/}
            {/*            .run()*/}
            {/*    }*/}
            {/*    className={editor.isActive('strike') ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    Strike*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleCode().run()}*/}
            {/*    disabled={*/}
            {/*        !editor.can()*/}
            {/*            .chain()*/}
            {/*            .focus()*/}
            {/*            .toggleCode()*/}
            {/*            .run()*/}
            {/*    }*/}
            {/*    className={editor.isActive('code') ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    Code*/}
            {/*</button>*/}
            {/*<button onClick={() => editor.chain().focus().unsetAllMarks().run()}>*/}
            {/*    Clear marks*/}
            {/*</button>*/}
            {/*<button onClick={() => editor.chain().focus().clearNodes().run()}>*/}
            {/*    Clear nodes*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().setParagraph().run()}*/}
            {/*    className={editor.isActive('paragraph') ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    Paragraph*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}*/}
            {/*    className={editor.isActive('heading', {level: 1}) ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    H1*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}*/}
            {/*    className={editor.isActive('heading', {level: 2}) ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    H2*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}*/}
            {/*    className={editor.isActive('heading', {level: 3}) ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    H3*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleHeading({level: 4}).run()}*/}
            {/*    className={editor.isActive('heading', {level: 4}) ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    H4*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleHeading({level: 5}).run()}*/}
            {/*    className={editor.isActive('heading', {level: 5}) ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    H5*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleHeading({level: 6}).run()}*/}
            {/*    className={editor.isActive('heading', {level: 6}) ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    H6*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleBulletList().run()}*/}
            {/*    className={editor.isActive('bulletList') ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    Bullet list*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleOrderedList().run()}*/}
            {/*    className={editor.isActive('orderedList') ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    Ordered list*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleCodeBlock().run()}*/}
            {/*    className={editor.isActive('codeBlock') ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    Code block*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().toggleBlockquote().run()}*/}
            {/*    className={editor.isActive('blockquote') ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    Blockquote*/}
            {/*</button>*/}
            {/*<button onClick={() => editor.chain().focus().setHorizontalRule().run()}>*/}
            {/*    Horizontal rule*/}
            {/*</button>*/}
            {/*<button onClick={() => editor.chain().focus().setHardBreak().run()}>*/}
            {/*    Hard break*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().undo().run()}*/}
            {/*    disabled={*/}
            {/*        !editor.can()*/}
            {/*            .chain()*/}
            {/*            .focus()*/}
            {/*            .undo()*/}
            {/*            .run()*/}
            {/*    }*/}
            {/*>*/}
            {/*    Undo*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().redo().run()}*/}
            {/*    disabled={*/}
            {/*        !editor.can()*/}
            {/*            .chain()*/}
            {/*            .focus()*/}
            {/*            .redo()*/}
            {/*            .run()*/}
            {/*    }*/}
            {/*>*/}
            {/*    Redo*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => editor.chain().focus().setColor('#958DF1').run()}*/}
            {/*    className={editor.isActive('textStyle', {color: '#958DF1'}) ? 'is-active' : ''}*/}
            {/*>*/}
            {/*    Purple*/}
            {/*</button>*/}
        </div>
    )
}

export default ToolBar