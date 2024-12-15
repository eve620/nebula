import React from "react";

interface ProgressProps {
    currentMode: string,
    percent: string
}

const Progress: React.FC<ProgressProps> = ({currentMode, percent}) => {

    return (
        <div className={"h-3 bg-green-500 rounded rounded-l-none duration-200"}
             style={{width: `${currentMode === "Summary" ? "100%" : percent + "%"}`}}/>
    )
}

export default Progress;