import React from 'react';
import SideBar from "@/app/message/SideBar";

export default function Layout({children}: Readonly<{ children: React.ReactNode; }>) {

    return (
        <div className="container px-4 my-8 mx-auto h-[calc(100vh-8rem)]">
            <SideBar/>
            {children}
        </div>
    );
}
