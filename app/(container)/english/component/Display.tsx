import React from "react";

interface DisplayProps {
    chinese: string,
    soundmark: string,
    english: string,
    handlePlayClick: () => void
}

const Display: React.FC<DisplayProps> = ({chinese, soundmark, english, handlePlayClick}) => {
    return (
        <>
            <div className={"flex items-center"}>
                <div className={"text-4xl pb-2 text-fuchsia-400 dark:text-gray-50 font-semibold ml-5"}>{english}</div>
                <svg
                    className="w-7 h-7 inline-block ml-1 cursor-pointer"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handlePlayClick}>
                    <path
                        d="M342.4 384H128v256h214.4L576 826.8V197.2L342.4 384zM64 320h256L640 64v896L320 704H64V320z m640 256h256v-64H704v64z m16.8 159.5l181 181 45.3-45.3-181-181-45.3 45.3z m33.9-343.9l181-181-45.3-45.3-181 181 45.3 45.3z"
                        fill="#666666"></path>
                </svg>
            </div>
            <div className={"text-xl text-gray-500 dark:text-gray-400 mt-2 mb-3"}>{soundmark}</div>
            <div className={"text-xl text-gray-500 dark:text-gray-400 mb-3"}>{chinese}</div>
        </>
    )
}
export default Display