import KanbanBoard from "@/app/(container)/kanban/KanbanBoard";
import getEventList from "@/app/actions/getEventList";

export interface eventDataProps {
    id: number,
    title: string,
    toDo: string[],
    inProgress: string[],
    completed: string[]
}

export default async function Page() {
    let eventData: eventDataProps[] = await getEventList() || []
    return (
        <KanbanBoard eventData={eventData}/>
    );
}