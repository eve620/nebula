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
import {useUser} from "@/contexts/user-context";
import {removeLocalEvent, updateLocalEvent} from "@/utils/eventsStorage";

const TaskBox = ({events, setEvents, currentIndex, setCurrentIndex}) => {
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const user = useUser()
    const handleRemove = useCallback(async () => {
        if (!user) {
            const res = removeLocalEvent(events[currentIndex].title)
            if (res.status) {
                const data = res.data
                setEvents(data);
                if (data.length) {
                    setCurrentIndex(0);
                }
                showMessage("删除成功")
            }
            return
        }
        const removeEvent = await fetch("/api/kanban", {
            method: "DELETE",
            body: JSON.stringify({title: events[currentIndex].title}),
        })
        if (removeEvent.ok) {
            setEvents((prev) => {
                const result = prev.filter((item) => item.title != events[currentIndex].title);
                if (result.length) {
                    setCurrentIndex(0);
                }
                return result;
            });
            showMessage("删除成功")
        }
    }, [user, setEvents]);
    const handleChange = (newEvent) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            if (!user) {
                updateLocalEvent(newEvent)
                return
            }
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
            ...events[currentIndex]
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
            if (event.title === events[currentIndex].title) {
                return eventCopy
            }
            return event
        })
        handleChange(eventCopy)
        setEvents(nextEvents)
    }, [currentIndex, handleChange, events, setEvents]);
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
                                    currentIndex={currentIndex}
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
