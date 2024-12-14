"use client"
import {Button} from "@/components/ui/button";
import React from "react";
import {useRouter} from "next/navigation";

interface OperationBarProps {
}

const OperationBar: React.FC<OperationBarProps> = () => {
    const router = useRouter()
    return (
        <div className={"flex justify-between pb-6 pr-6"}>
            <span className={"font-bold ml-10"}>我的项目：</span>
            <Button onClick={() => {
                router.push('/project/new')
            }}>添加项目</Button>
        </div>
    )
}

export default OperationBar