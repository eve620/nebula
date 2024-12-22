'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type RouteGuardProps = {
    children: React.ReactNode
    requireAuth?: boolean
    requireAdmin?: boolean
}

export function RouteGuard({ children, requireAuth = false, requireAdmin = false }: RouteGuardProps) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'loading') return // 等待session加载完成

        if (requireAuth && !session) {
            router.push('/login') // 重定向到登录页
        } else if (requireAdmin && session?.user?.role !== 'admin') {
            router.push('/') // 非管理员重定向到首页
        }
    }, [session, status, requireAuth, requireAdmin, router])

    if (status === 'loading') {
        return <div>Loading...</div> // 或者使用一个加载动画组件
    }

    if ((requireAuth && !session) || (requireAdmin && session?.user?.role !== 'admin')) {
        return null // 不渲染任何内容，等待重定向
    }

    return <>{children}</>
}
