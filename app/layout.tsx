import {Navbar} from '@/components/navbar'
import './globals.css'
import type {Metadata} from 'next'
import {cookies} from "next/headers";
import React from "react";
import {notoSansSC} from "@/app/fonts";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {UserProvider} from "@/contexts/user-context";
import {Toaster} from "@/components/ui/toaster";

export const metadata: Metadata = {
    title: {
        template: '星云 | %s',
        default: '星云', // a default is required when creating a template
    },
    description: '星云学习',
}

export default async function RootLayout({children,}: { children: React.ReactNode }) {
    const theme = await cookies()
    const isDark = (theme.get('theme')?.value || 'light') === 'dark'
    const currentUser = await getCurrentUser()
    return (
        <html lang="zh" className={`${notoSansSC.variable} ${isDark && 'dark'}`}>
        <head>
            <title>
                星云
            </title>
        </head>
        <body>
        <UserProvider value={currentUser}>
            <Navbar
                curTheme={isDark ? 'dark' : 'light'}
            />
            <main>
                {children}
            </main>
        </UserProvider>
        <Toaster/>
        </body>
        </html>
    )
}

