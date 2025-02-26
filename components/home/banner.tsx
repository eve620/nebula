"use client"

import Image from "next/image";
import {AnimatedText} from "@/components/animated-text";
import {Button} from "@/components/ui/button";
import {useSearchParams} from "next/navigation";
import showMessage from "@/components/message";
import {useEffect} from "react";

export default function Banner() {
    const searchParams = useSearchParams()

    useEffect(() => {
        const auth = searchParams.get('no-auth')
        const access = searchParams.get('no-access')
        if (auth) {
            showMessage("请先登录！")
        } else if (access) {
            showMessage("无权限！")
        }
    }, [searchParams])

    const scrollToDemo = () => {
        const demoSection = document.getElementById("demo")
        if (demoSection) {
            // const rect = demoSection.getBoundingClientRect();
            // const scrollTop = window.pageYOffset + rect.top - offset;
            const offsetTop = demoSection.offsetTop;
            const scrollTop = offsetTop - 64;
            window.scrollTo({top: scrollTop, behavior: 'smooth'});
        }
    }
    return (
        <div className={"group"}>
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src={"/bg/bg6.jpeg"}
                    alt="Cyberpunk city background"
                    fill
                    priority={true}
                    style={{objectFit: "cover"}}
                    className="opacity-95 dark:opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
            </div>
            <div className="relative z-10 text-center">
                <h1 className="text-6xl font-bold mb-4 animate-pulse">NEBULA</h1>
                <p className="text-xl mb-8">
                    <AnimatedText text="探索知识的海洋"/>
                </p>
                <Button onClick={scrollToDemo}>
                    开始体验
                </Button>
            </div>
        </div>
    );
}
