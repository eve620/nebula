"use client"
import React from "react";

const TopBar: React.FC = () => {
    const scrollToAbout = () => {
        const aboutSection = document.getElementById('aboutSection');
        if (aboutSection) {
            aboutSection.scrollIntoView({behavior: 'smooth'});
        }
    };
    return (
        <div className="
            max-w-6xl mx-auto
            md:max-w-[70%]
            bg-purple-200
            dark:bg-gray-800 dark:text-white
            px-4 py-3 text-black
            sm:flex sm:items-center sm:justify-between sm:px-6
            lg:px-8 rounded-lg">
            <span className={'font-semibold text-sm opacity-90'}>关于Nebula，以下是一些使用说明和介绍</span>
            <span onClick={scrollToAbout}
                  className="mt-4 block rounded-lg bg-white px-5 py-3
                      text-center text-sm font-bold text-purple-600 transition
                      hover:bg-white/90 hover:text-pink-500
                      focus:outline-none focus:ring active:text-pink-500 sm:mt-0">
                关于我
            </span>
        </div>
    )
}
export default TopBar