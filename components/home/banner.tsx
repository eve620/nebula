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
        }else if(access){
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
        <>
            <div className="absolute inset-0 z-0">
                <Image
                    src="/placeholder.svg"
                    alt="Cyberpunk city background"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-50 dark:opacity-30"
                />
            </div>
            <div className="relative z-10 text-center">
                <h1 className="text-6xl font-bold mb-4 animate-pulse">SUZVC</h1>
                <p className="text-xl mb-8">
                    <AnimatedText text="探索未来世界的秘密"/>
                </p>
                <Button onClick={scrollToDemo}>
                    开始体验
                </Button>
            </div>
        </>
    );
}
