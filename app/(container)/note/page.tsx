import Notes from "@/app/(container)/note/Notes";
import getNoteList from "@/app/actions/getNoteList";
import {Note} from "@/types";

export default async function Page() {
    const noteList: Note[] = await getNoteList() || []
    return (
        <Notes notes={noteList}/>
    );
}

