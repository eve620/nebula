import KanbanBoard from "@/app/kanban/KanbanBoard";
import getEventList from "@/app/actions/getEventList";
import React from "react";
import {EventType} from "@/types";

export default async function Page() {
    let eventData: EventType[] = await getEventList() || []
    return (
        <div className="container px-4 py-8  mx-auto h-[calc(100vh-4rem)]">
            <KanbanBoard eventData={eventData}/>
        </div>
    );
}