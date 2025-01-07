"use client"

import React, {useCallback, useState} from 'react';
import AddButton from './AddButton';
import {Modal} from "@/components/modal/modal";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useUser} from "@/contexts/user-context";
import useLoginModal from "@/hooks/use-login-modal";
import showMessage from "@/components/message";

const EventBar = ({events, setEvents, currentEvent, setCurrentEvent}) => {
    const [isAddEvent, setIsAddEvent] = useState(false)
    const [newEventName, setNewEventName] = useState('')
    const user = useUser()
    const loginStore = useLoginModal()
    const handleAdd = useCallback(() => {
        // Prevent Duplicated
        if (events.find((event) => event.title.toLowerCase() === newEventName.trim().toLowerCase())) {
            //toast
            return;
        }
        if (!newEventName) {
            //toast
        }
        // Add new event
        if (newEventName) {
            setEvents((prev) => [
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
        <div className='text-center border-r-2 min-w-52 max-w-64'>
            <h1 className='text-2xl font-semibold pt-5 pb-2'>代办事项</h1>
            <AddButton handleClick={() => {
                if (!user) {
                    showMessage("请登录以使用完整功能。")
                    loginStore.onOpen()
                    return
                }
                setIsAddEvent(true)
            }}/>
            <div className='px-8 cursor-pointer'>
                {events.map((item) => (
                    <div style={{transitionProperty: 'background-color'}}
                         key={item.title}
                         className={`px-8 mb-2 text-xl py-2 rounded-3xl truncate hover:duration-200
                        hover:bg-[#2c4885] hover:text-white
                        ${currentEvent && currentEvent.title === item.title && 'text-white bg-[#406cc7]'}`}
                         onClick={() => setCurrentEvent(item)}
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
