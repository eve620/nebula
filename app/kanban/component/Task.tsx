import {Minus} from "lucide-react";
import React from "react";

interface TaskProps {
    name: string;
    details: string;
    id: number;
    provided;
    handleUpdate: (id: number) => void;
    handleRemove: (id: number, e) => void;
}

const Task: React.FC<TaskProps> = ({name, details, id, provided, handleUpdate, handleRemove}) => {
    return (
        <div
            className="bg-gray-50 relative dark:bg-gray-600 p-4 mb-2 rounded text-gray-800
            dark:text-gray-200 hover:opacity-80"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => handleUpdate(id)}
        >
            <div className={'flex text-sm items-center'}>
                <span className={'text-[0.6em] mr-1 text-[#9c9c9c]'}>●</span>
                <h2 className='truncate'>{name}</h2>
            </div>
            <p className='text-[0.7em] mt-2 text-[#9c9c9c] break-words mb-2'>{details}</p>
            <Minus
                className={'absolute right-0 bottom-0 w-10 h-8 cursor-pointer hover:scale-125 px-3 py-2 hover:text-red-500 hover:duration-200'}
                onClick={(e) => handleRemove(id, e)}/>
            <div>
            </div>
        </div>
    );
};

export default Task;
