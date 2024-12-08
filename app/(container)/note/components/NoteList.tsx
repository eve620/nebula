import NoteItem from "@/app/(container)/note/components/NoteItem";
import Empty from "@/components/empty";
import React from "react";

interface NoteListProps {
    notes: Note[]
}

export type Note = {
    id: number
    title: string,
}
const NoteList: React.FC<NoteListProps> = ({notes}: { notes: Note[] }) => {
    return (
        <>
            {notes.length ?
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {notes.map((item, index) =>
                        <NoteItem key={index} note={item}/>)
                    }
                </div> :
                <Empty/>
            }
        </>
    )
}
export default NoteList