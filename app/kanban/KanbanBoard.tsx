"use client"
import React, {useEffect, useState} from "react";
import TaskBox from "@/app/kanban/component/TaskBox";
import EventBar from "@/app/kanban/component/EventBar";
import {EventType} from "@/types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarPlus, PlusCircle} from "lucide-react";
import {useUser} from "@/contexts/user-context";
import {getLocalEvents} from "@/utils/eventsStorage";

export interface KanbanBoardProps {
    eventData: EventType[]
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({eventData}) => {
    const [events, setEvents] = useState<EventType[]>(eventData);
    const [currentIndex, setCurrentIndex] = useState(0);
    const user = useUser()


    useEffect(() => {
        if (!user) {
            setEvents(getLocalEvents())
        } else setEvents(eventData)
    }, [user, setEvents, eventData]);

    return (
        <div className='flex h-full'>
            <EventBar
                events={events}
                setEvents={setEvents}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
            />
            {events.length ? <TaskBox
                setEvents={setEvents}
                events={events}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
            /> : (
                <div className="flex-1 flex justify-center items-center p-8">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-center">没有事件</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center space-y-4">
                                <CalendarPlus className="h-16 w-16 text-muted-foreground"/>
                                <p className="text-center text-muted-foreground">
                                    点击左侧 <PlusCircle className="inline h-5 w-5"/> 添加新事件
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default KanbanBoard