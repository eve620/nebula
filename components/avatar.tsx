import Image from "next/image";
import React from "react";

export default function Avatar({url, className = ''}: { url?: string, className?: string }) {
    return (
        <div
            className={`w-9 h-9 bg-blue-300 rounded-full overflow-hidden ${className}`}>
            <Image src={url || '/avatar.png'} alt="avatar" width={100}
                   height={100}/>
        </div>
    )
}