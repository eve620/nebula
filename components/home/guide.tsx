import Image from "next/image";
import Link from "next/link";
import React from "react";

const Guide: React.FC = () => {
    return (
        <div className={'sm:columns-2 max-w-6xl mx-auto'}>
            <div className="overflow-hidden">
                <Image className={"mx-auto mt-2 rounded-md"} width={150} height={150} src={"/storage/avatar/avatar1.jpg"}
                       alt={"picture"}/>
                <span className={"text-3xl leading-loose inline-block"}>Why aren’t you good at English?</span>
                <span
                    className={"text-3xl leading-loose inline-block"}>It’s because you haven’t used Log yet!</span>
                <Link className="
                    w-full py-2 my-8 mx-auto sm:mx-0 sm:w-48 text-center rounded-md font-bold hover:duration-200 block
                    text-black dark:text-gray-300
                    bg-gray-200 dark:bg-neutral-800
                    hover:bg-gray-300 dark:hover:bg-neutral-900" href={""}>Github</Link>
            </div>
            <div className="hidden sm:block">
                <div className="overflow-hidden
                                bg-gray-50 border border-gray-200 dark:border-gray-500
                                dark:from-[#525252e6] dark:bg-gradient-to-b dark:to-gray-900
                                rounded-2xl p-4 hover:duration-200
                                hover:shadow-lg dark:shadow-md dark:hover:shadow-slate-700/70
                                ">
                    <div className={"pr-2"}>
                        <h2 className={"text-xl font-bold py-4"}>使用指南</h2>
                        <h3 className={"pb-2 font-semibold"}>点击这里开始哦</h3>
                        <p className={"py-1 leading-7 text-sm"}>教你一下怎么用教你一下怎么用教你一下怎么用教你一下怎么用教你一下怎么用教你一下怎么用教你一下怎么用教你一下怎么用教你一下怎么用教你一下怎么用教你一下怎么用教你一下怎么用</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Guide