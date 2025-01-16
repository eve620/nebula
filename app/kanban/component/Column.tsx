"use client"

import Task from './Task';
import {Droppable, Draggable} from '@hello-pangea/dnd';
import React, {useEffect, useState} from "react";
import AddButton from "@/app/kanban/component/AddButton";
import {Modal} from "@/components/modal/modal";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {updateLocalEvent} from "@/utils/eventsStorage";
import {useUser} from "@/contexts/user-context";

const tagTextMap = {
    toDo: '代办',
    inProgress: '进行中...',
    completed: '已完成',
};

const Column = ({tag, currentIndex, events, setEvents}) => {
    const [isModalShow, setIsModalShow] = useState(false)
    const [newTaskName, setNewTaskName] = useState('')
    const [newTaskDetail, setNewTaskDetail] = useState('')
    const [operation, setOperation] = useState<'ADD' | 'EDIT'>('ADD');
    const [currentTaskId, setCurrentTaskId] = useState<number | undefined>();
    const user = useUser()
    const handleAdd = () => {
        setOperation("ADD")
        setIsModalShow(true)
    };
    const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const handleRemove = (id: number, e: Event) => {
        // 禁止冒泡到上层:修改task
        e.stopPropagation();
        setEvents((prev) =>
            prev.map((event) => {
                if (event.title === events[currentIndex].title) {
                    const taskList = event[tag];
                    const index = taskList.findIndex((item) => item.id === id);
                    if (index < 0) return event
                    taskList.splice(index, 1);
                    const newEvent = {...event, [tag]: [...taskList]}
                    if (!user) updateLocalEvent(newEvent)
                    return newEvent;
                } else {
                    return event;
                }
            })
        );
    };
    useEffect(() => {
        if (operation === 'EDIT' && currentTaskId !== undefined) {
            const taskToEdit = events.find((event) => event.title === events[currentIndex].title)?.[tag]?.find((task) => task.id === currentTaskId);
            if (taskToEdit) {
                setNewTaskName(taskToEdit.name);
                setNewTaskDetail(taskToEdit.details);
            }
        } else {
            setNewTaskName("")
            setNewTaskDetail("")
        }
    }, [operation, currentTaskId, events, currentIndex, tag]);
    const handleUpdate = (id: number) => {
        setOperation('EDIT');
        setIsModalShow(true)
        setCurrentTaskId(id)
    };
    const taskSubmit = (e) => {
        e.preventDefault()
        if (operation === 'ADD') {
            if (!(newTaskName.trim() && newTaskDetail.trim())) {
                //toast
                return
            }
            setEvents((prev) => {
                const arrCopy = [...prev];
                const index = prev.findIndex(
                    (event) => event.title === events[currentIndex].title
                );
                const eventCopy = arrCopy[index];
                const addTask = {
                    ...eventCopy,
                    [tag]: [
                        ...eventCopy[tag],
                        {name: newTaskName.trim(), id: generateId(), details: newTaskDetail.trim()},
                    ],
                }
                arrCopy.splice(index, 1, addTask);
                if (!user) updateLocalEvent(addTask)
                return arrCopy;
            });
        } else if (operation === 'EDIT') {
            if (!(newTaskName.trim() && newTaskDetail.trim())) {
                //toast
                return
            }
            setEvents((prev) =>
                prev.map((event) => {
                    if (event.title === events[currentIndex].title) {
                        const taskList = event[tag];
                        const index = taskList.findIndex((item) => item.id === currentTaskId);
                        const updatedTask = {
                            ...taskList[index],
                            name: newTaskName.trim(),
                            details: newTaskDetail.trim(),
                        };
                        taskList.splice(index, 1, updatedTask);
                        const newEvent = {...event, [tag]: taskList}
                        if (!user) updateLocalEvent(newEvent)
                        return newEvent;
                    } else {
                        return event;
                    }
                })
            );
        }
        setIsModalShow(false)
    }

    return (
        <>
            <div className='bg-white dark:bg-gray-700 p-4 rounded-lg w-64 shadow-md mx-3'>
                <span
                    className={'text-sm font-semibold'}>{tagTextMap[tag as ("toDo" | "inProgress" | "completed")]}</span>
                <AddButton handleClick={handleAdd}/>
                <Droppable droppableId={tag}>
                    {(provided) => {
                        return (
                            <div
                                className='min-h-16 max-h-[40vh] overflow-y-auto px-2 overflow-x-hidden'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {events[currentIndex]
                                    ?.[tag].map((item, index: number) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <Task
                                                name={item.name}
                                                details={item.details}
                                                id={item.id}
                                                provided={provided}
                                                handleRemove={handleRemove}
                                                handleUpdate={handleUpdate}
                                            />
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        );
                    }}
                </Droppable>
            </div>
            <Modal title={`${operation === "ADD" ? "添加" : "编辑"}任务`}
                   description={"请输入任务信息。"} isOpen={isModalShow}
                   onClose={() => setIsModalShow(false)}>
                <form onSubmit={taskSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">标题</Label>
                        <Input
                            id="eventName"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            placeholder="请输入..."
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username">内容</Label>
                        <Input
                            id="eventName"
                            value={newTaskDetail}
                            onChange={(e) => setNewTaskDetail(e.target.value)}
                            placeholder="请输入..."
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">确定</Button>
                </form>
            </Modal>
        </>
    );
};

export default Column;
