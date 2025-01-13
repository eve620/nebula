"use client"
import React, {useCallback, useRef} from 'react';
import Column from './Column';
import {DragDropContext, DropResult} from "@hello-pangea/dnd";
import {Button} from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import showMessage from "@/components/message";

const TaskBox = ({events, setEvents, currentEvent, setCurrentEvent}) => {
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const handleRemove = useCallback(async () => {
        const removeEvent = await fetch("/api/kanban", {
            method: "DELETE",
            body: JSON.stringify({title: currentEvent.title}),
        })
        if (removeEvent.ok) {
            setEvents((prev) => {
                const result = prev.filter((item) => item.title != currentEvent.title);
                if (result.length) {
                    setCurrentEvent(result[0]);
                }
                return result;
            });
            showMessage("删除成功")
        }
    }, [setEvents, currentEvent, setCurrentEvent]);
    const handleChange = (newEvent) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            fetch("/api/kanban", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEvent)
            });
        }, 2000)
    };

    const handleDragEnd = useCallback(async (result: DropResult) => {
        if (!result.destination) return;
        const {source, destination} = result;
        const eventCopy = {
            ...currentEvent
        }
        const sourceList = [...eventCopy[source.droppableId]];
        const destinationList = [...eventCopy[destination.droppableId]];
        // 取出 source 位置的任务
        const [movedTask] = sourceList.splice(source.index, 1);
        // 将任务插入到 destination 位置
        destinationList.splice(destination.index, 0, movedTask);
        // 更新 eventCopy 中的 source 和 destination 列表
        eventCopy[source.droppableId] = sourceList;
        eventCopy[destination.droppableId] = destinationList;
        const nextEvents = events.map(event => {
            if (event.title === currentEvent.title) {
                return eventCopy
            }
        })
        handleChange(eventCopy)
        setCurrentEvent(eventCopy)
        setEvents(nextEvents)
    }, [events, currentEvent, setEvents, setCurrentEvent]);
    return (
        <>
            <div className='flex flex-col flex-1'>
                <header className='flex items-center pl-24'>
                    <h1 className='text-2xl font-[500] mr-4'>所有任务</h1>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button>删除事件</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
                                <AlertDialogDescription>
                                    此操作无法撤消。这将永久删除您的事件，且无法恢复。
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRemove}>确认删除</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </header>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className='flex w-full justify-evenly mt-12 items-start mx-3'>
                        {
                            ['toDo', 'inProgress', 'completed'].map((tag) => (
                                <Column
                                    key={tag}
                                    tag={tag}
                                    events={events}
                                    setEvents={setEvents}
                                    currentEvent={currentEvent}
                                />
                            ))
                        }
                    </div>
                </DragDropContext>
            </div>
        </>
    );
};

export default TaskBox;
