import getNoteList from "@/app/actions/getNoteList";
import {Note} from "@/types";
import Notes from "@/app/my/article/Notes";

export default async function Page() {
    const noteList: Note[] = await getNoteList() || []
    return (
        <Notes notes={noteList}/>
    );
}

