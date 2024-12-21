"use client"

import Link from "next/link";
import showMessage from "@/components/message";
import {useUser} from "@/contexts/user-context";
import useLoginModal from "@/hooks/use-login-modal";

export default function Navigate() {
    const currentUser = useUser()
    const loginStore = useLoginModal()
    const navList = [
        {
            title: "知识分享",
            description: "探索和分享知识，让创新与灵感无处不在，一起构建智慧的桥梁！",
            icon: "👩‍💻",
            href: "/forum"

        },
        {
            title: "项目记录",
            description: "轻松记录完成的项目、掌握目标和关键任务！",
            icon: "🎯",
            href: "/my/project"
        },
        {
            title: "英语学习",
            description: "学习新词汇、提高英语水平，踏上你的英语进阶之旅！",
            icon: "📚",
            href: "/english"
        },
        {
            title: "代办记录",
            description: "记录代办任务，规划时间，轻松完成每个目标！",
            icon: "📝",
            href: "/kanban"
        }
    ]
    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            {navList.map((item, index) => (
                <Link key={index} href={item.href}
                      onClick={(e) => {
                          if (item.title === "项目记录" && !currentUser) {
                              showMessage("请先登录以访问功能！")
                              loginStore.onOpen()
                              e.preventDefault()
                          }
                      }}
                      className="bg-card p-6 rounded-lg shadow-lg dark:shadow-slate-800 hover:bg-accent transition-transform hover:transition ease-in-out hover:-translate-y-1">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                </Link>
            ))}
        </div>
    );
}