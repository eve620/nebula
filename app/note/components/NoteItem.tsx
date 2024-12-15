import {useRouter} from "next/navigation";
import React from "react";
import {Note} from "@/types";

interface NoteItemProps {
    note: Note,
}

const NoteItem: React.FC<NoteItemProps> = ({note}) => {
    const router = useRouter()
    return (
        <div className="
        cursor-pointer
        select-none
                      outline
                      outline-1
                      dark:outline-transparent
                          text-gray-600
                          dark:text-gray-300
                            py-3
                             mb-8
                             sm:break-inside-avoid
                             rounded-lg
                             text-center
                             text-xl
                             shadow-lg
                             transition-transform
                             dark:bg-gray-700 dark:hover:shadow-blue-700/30
                             hover:-translate-y-1
                             hover:shadow-xl hover:shadow-black/10" onClick={() => {
            router.push(`/note/${note.id}`)
        }}>
            {note.title}
        </div>
    )
}

export default NoteItem