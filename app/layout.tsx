import {Navbar} from '@/components/navbar'
import './globals.css'
import type {Metadata} from 'next'
import {cookies} from "next/headers";
import React from "react";
import {notoSansSC} from "@/app/fonts";

export const metadata: Metadata = {
    title: 'Focus',
    description: '聚焦',
}

export default async function RootLayout({children,}: { children: React.ReactNode }) {
    const theme = await cookies()
    const isDark = (theme.get('theme')?.value || 'light') === 'dark'
    return (
        <html lang="zh" className={`${notoSansSC.variable} ${isDark && 'dark'}`}>
        <body>
        <Navbar
            // currentUser={null}
            currentUser={{
                id: '1',
                account: 'admin',
                username: '傻子哥',
                bio: '这是一个用户描述',
                avatarUrl: '/placeholder.svg',
                isAdmin: false
            }}
            curTheme={isDark ? 'dark' : 'light'}
        />
        {children}
        </body>
        </html>
    )
}

