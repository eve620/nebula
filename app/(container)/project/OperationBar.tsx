"use client"
import {Button} from "@/components/ui/button";
import React from "react";

interface OperationBarProps {
}

const OperationBar: React.FC<OperationBarProps> = () => {
    return (
        <div className={"flex justify-between pb-6 pr-6"}>
            <span className={"font-bold ml-10"}>我的项目：</span>
            <Button onClick={() => {
            }}>添加项目</Button>
        </div>
    )
}

export default OperationBar