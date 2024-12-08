"use client"
import React, {useCallback, useEffect, useState} from "react";
import TaskBox from "@/app/(container)/kanban/component/TaskBox";
import EventBar from "@/app/(container)/kanban/component/EventBar";
import {eventDataProps} from "@/app/(container)/kanban/page";
import {useRouter} from "next/navigation";

export interface KanbanBoardProps {
    eventData: eventDataProps[]
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({eventData}) => {
    const [events, setEvents] = useState<eventDataProps[]>(eventData);
    const [currentEvent, setCurrentEvent] = useState(events[0] || null);
    const [prevLength, setPrevLength] = useState(events.length);
    const router = useRouter()
    const updateProgress = useCallback(async () => {
        const response = await fetch("/api/kanban", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({events})
        });
        if (response.ok) router.refresh()
    }, [events]);
    useEffect(() => {
        const currentLength = events.length;
        updateProgress()
        if (currentLength !== prevLength) {
            setPrevLength(currentLength);
        }
    }, [updateProgress, prevLength, events]);

    return (
        <div className='flex'>
            <EventBar
                events={events}
                setEvents={setEvents}
                currentEvent={currentEvent}
                setCurrentEvent={setCurrentEvent}
            />
            {events.length && currentEvent ? <TaskBox
                setEvents={setEvents}
                currentEvent={currentEvent}
                events={events}
                setCurrentEvent={setCurrentEvent}
            /> : <div className={"text-nowrap flex-1 flex justify-center items-center text-3xl font-bold px-8"}>
                点击左侧➕添加事件
            </div>}
        </div>
    );
}

export default KanbanBoard