"use client"

import React, {useCallback, useState} from 'react';
import AddButton from './AddButton';
import {Modal} from "@/components/modal/modal";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useUser} from "@/contexts/user-context";
import showMessage from "@/components/message";
import {addLocalEvent} from "@/utils/eventsStorage";

const EventBar = ({events, setEvents, currentIndex, setCurrentIndex}) => {
    const [isAddEvent, setIsAddEvent] = useState(false)
    const [newEventName, setNewEventName] = useState('')
    const user = useUser()
    const handleAdd = useCallback(async (e) => {
        e.preventDefault()
        if (!user) {
            const res = addLocalEvent(newEventName.trim().toLowerCase())
            if (res.status) {
                const data = res.data
                setEvents(data)
                setCurrentIndex(data.length - 1)
                setIsAddEvent(false)
                setNewEventName("")
            }
            showMessage(res.message)
            return
        }
        if (events.find((event) => event.title.toLowerCase() === newEventName.trim().toLowerCase())) {
            showMessage("事件已存在")
            return;
        }
        if (!newEventName) {
            showMessage("事件名不能为空")
        }
        // Add new event
        if (newEventName && user) {
            const newEvent = {
                title: newEventName.trim(),
                toDo: [],
                inProgress: [],
                completed: [],
            }
            const newEvents = [
                ...events,
                newEvent,
            ]
            const response = await fetch("/api/kanban", {
                method: "POST",
                body: JSON.stringify(newEvent)
            });
            if (response.ok) {
                showMessage("添加成功！")
                setEvents(newEvents)
                setCurrentIndex(newEvents.length - 1)
            }
        }
        setIsAddEvent(false)
        setNewEventName("")
    }, [user, newEventName, events, setEvents, setCurrentIndex]);

    return (
        <div className='text-center border-r-2 min-w-52 max-w-64'>
            <h1 className='text-2xl font-semibold pt-5 pb-2'>代办事项</h1>
            <AddButton handleClick={() => {
                setIsAddEvent(true)
            }}/>
            <div className='px-8 cursor-pointer'>
                {events.map((item, index) => (
                    <div style={{transitionProperty: 'background-color'}}
                         key={item.title}
                         className={`px-8 mb-2 text-xl py-2 rounded-3xl truncate hover:duration-200
                        hover:bg-[#2c4885] hover:text-white
                        ${events && events[currentIndex].title === item.title && 'text-white bg-[#406cc7]'}`}
                         onClick={() => setCurrentIndex(index)}
                    >
                        {item.title}
                    </div>
                ))}
            </div>
            <Modal title={"添加"} isOpen={isAddEvent} description="请输入要添加的事件。" onClose={() => {
                setIsAddEvent(false)
                setNewEventName("")
            }}>
                <form onSubmit={handleAdd} className="space-y-4">
                    <Input
                        id="eventName"
                        value={newEventName}
                        onChange={(e) => setNewEventName(e.target.value)}
                        placeholder="请输入..."
                        required
                    />
                    <Button type="submit" className="w-full">确定</Button>
                </form>
            </Modal>
        </div>
    );
};

export default EventBar;
