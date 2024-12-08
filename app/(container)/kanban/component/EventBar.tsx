"use client"

import React, {useCallback, useState} from 'react';
import AddButton from './AddButton';
import {Input} from "postcss";
import {Modal} from "@/components/modal/modal";

interface EventBarProps {
    events: any
    setEvents: any
    currentEvent: any
    setCurrentEvent: any
}

const EventBar: React.FC<EventBarProps> = ({events, setEvents, currentEvent, setCurrentEvent}) => {
    const [isAddEvent, setIsAddEvent] = useState(false)
    const [newEventName, setNewEventName] = useState('')
    const modalBody = (
        <Input value={newEventName} onChange={(e) => setNewEventName(e.target.value)}/>
    )
    const handleAdd = useCallback(() => {
        // Prevent Duplicated
        if (
            events.find((event: any) => event.title.toLowerCase() === newEventName.trim().toLowerCase())
        ) {
            //toast
            return;
        }
        if (!newEventName) {
            //toast
        }
        // Add new event
        if (newEventName) {
            setEvents((prev: any) => [
                ...prev,
                {
                    title: newEventName.trim(),
                    toDo: [],
                    inProgress: [],
                    completed: [],
                },
            ]);
        }
        setNewEventName("")
        setIsAddEvent(false)
    }, [newEventName, events, setEvents]);

    return (
        <div className='text-center border-r-2 h-[80vh] min-w-52 max-w-64'>
            <h1 className='text-2xl font-semibold pt-5 pb-2'>代办事项</h1>
            <AddButton handleClick={() => setIsAddEvent(true)}/>
            <div className='px-8 cursor-pointer'>
                {events.map((item: any) => (
                    <div style={{transitionProperty: 'background-color'}}
                         key={item.title}
                         className={`px-8 mb-2 text-xl py-2 rounded-3xl truncate duration-200
                        hover:bg-[#deacde] dark:hover:bg-[#2c4885] hover:text-white
                        ${currentEvent && currentEvent.title === item.title && 'text-white bg-[#f1bbf1] dark:bg-[#406cc7]'}`}
                         onClick={() => setCurrentEvent(item)}
                    >
                        {item.title}
                    </div>
                ))}
            </div>
            <Modal title={"请输入名称"} body={modalBody} isOpen={isAddEvent} onClose={() => {
                setIsAddEvent(false)
                setNewEventName("")
            }}
                   onSubmit={handleAdd}
                   actionLabel={"确定"}>
                <div>

                </div>
            </Modal>
        </div>
    );
};

export default EventBar;
