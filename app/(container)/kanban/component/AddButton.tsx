import React from "react";

interface AddEventButtonProps {
    handleClick: () => void;
}

const AddButton: React.FC<AddEventButtonProps> = ({handleClick}) => {
    return (
        <div
            style={{transitionProperty: 'background-color'}}
            className='text-center w-4/5 mx-auto my-4 py-2 cursor-pointer
        bg-[#eaf1f0] dark:bg-slate-800 hover:bg-[#dfe2e2] dark:hover:bg-slate-800/60
        rounded-xl duration-200' onClick={handleClick}>
            +
        </div>
    );
};

export default AddButton;
