"use client"

import Task from './Task';
import {Droppable, Draggable} from '@hello-pangea/dnd';
import React, {useEffect, useState} from "react";
import AddButton from "@/app/(container)/kanban/component/AddButton";
import {Modal} from "@/components/modal/modal";
import {Input} from "@/components/ui/input";

interface ColumnProps {
    events: any[];
    setEvents: React.Dispatch<React.SetStateAction<any[]>>;
    currentEvent: any;
    tag: string;
}

const tagTextMap = {
    toDo: 'To do',
    inProgress: 'In progress',
    completed: 'Completed',
};

const Column: React.FC<ColumnProps> = ({tag, currentEvent, events, setEvents}) => {
    const [isModalShow, setIsModalShow] = useState(false)
    const [newTaskName, setNewTaskName] = useState('')
    const [newTaskDetail, setNewTaskDetail] = useState('')
    const [operation, setOperation] = useState<'ADD' | 'EDIT'>('ADD');
    const [currentTaskId, setCurrentTaskId] = useState<number | undefined>();
    const handleAdd = () => {
        setOperation("ADD")
        setIsModalShow(true)
    };

    const handleRemove = (id: number, e: Event) => {
        // 禁止冒泡到上层:修改task
        e.stopPropagation();
        setEvents((prev) =>
            prev.map((event) => {
                if (event.title === currentEvent.title) {
                    const taskList = event[tag];
                    const index = taskList.findIndex((item: any) => item.id === id);
                    taskList.splice(index, 1);
                    return {...event, [tag]: [...taskList]};
                } else {
                    return event;
                }
            })
        );
    };
    useEffect(() => {
        if (operation === 'EDIT' && currentTaskId !== undefined) {
            const taskToEdit = events.find((event) => event.title === currentEvent.title)?.[tag]?.find((task: any) => task.id === currentTaskId);
            if (taskToEdit) {
                setNewTaskName(taskToEdit.name);
                setNewTaskDetail(taskToEdit.details);
            }
        } else {
            setNewTaskName("")
            setNewTaskDetail("")
        }
    }, [operation, currentTaskId, events, currentEvent, tag]);
    const modalBody = (
        <div className={"space-y-3"}>
            <Input label={"名称"} value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)}/>
            <Input label={"内容"} value={newTaskDetail} onChange={(e) => setNewTaskDetail(e.target.value)}/>
        </div>
    )
    const handleUpdate = (id: number) => {
        setOperation('EDIT');
        setIsModalShow(true)
        setCurrentTaskId(id)
    };
    const taskSubmit = () => {
        if (operation === 'ADD') {
            if (!(newTaskName.trim() && newTaskDetail.trim())) {
                //toast
                return
            }
            setEvents((prev) => {
                const arrCopy = [...prev];
                const index = prev.findIndex(
                    (event) => event.title === currentEvent.title
                );
                const eventCopy = arrCopy[index];
                // Remove old and add the latest data
                arrCopy.splice(index, 1, {
                    ...eventCopy,
                    [tag]: [
                        ...eventCopy[tag],
                        {name: newTaskName.trim(), id: crypto.randomUUID(), details: newTaskDetail.trim()},
                    ],
                });
                return arrCopy;
            });
        } else if (operation === 'EDIT') {
            if (!(newTaskName.trim() && newTaskDetail.trim())) {
                //toast
                return
            }
            setEvents((prev) =>
                prev.map((event) => {
                    if (event.title === currentEvent.title) {
                        const taskList = event[tag];
                        const index = taskList.findIndex((item: any) => item.id === currentTaskId);
                        const updatedTask = {
                            ...taskList[index],
                            name: newTaskName.trim(),
                            details: newTaskDetail.trim(),
                        };
                        taskList.splice(index, 1);
                        return {...event, [tag]: [...taskList, updatedTask]};
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
                {tagTextMap[tag as ("toDo" | "inProgress" | "completed")]}
                <AddButton handleClick={handleAdd}/>
                <Droppable droppableId={tag}>
                    {(provided, snapshot) => {
                        return (
                            <div
                                className='min-h-16 max-h-[40vh] overflow-y-auto px-2 overflow-x-hidden'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {events
                                    .find((event) => event.title === currentEvent.title)
                                    ?.[tag].map((item: any, index: number) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
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
            <Modal title={`${operation === "ADD" ? "添加" : "编辑"}任务`} body={modalBody} isOpen={isModalShow}
                   onClose={() => setIsModalShow(false)}
                   onSubmit={taskSubmit}
                   actionLabel={"确定"}>
                <div>
                    123
                </div>
            </Modal>
        </>
    );
};

export default Column;
