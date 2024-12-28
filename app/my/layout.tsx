import React from 'react';
import OperationBar from "@/app/my/OperationBar";

export default function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="container px-4 py-8 mx-auto h-[calc(100vh-4rem)] min-h-fit text-nowrap">
            <OperationBar/>
            {children}
        </div>
    );
}
