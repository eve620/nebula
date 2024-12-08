'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from '@/components/admin/user-management'
import { PostManagement } from '@/components/admin/post-management'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if the user is an admin
    // This should be replaced with a proper authentication check
    const checkAdminStatus = async () => {
      // Simulating an API call
      const adminStatus = true // This should come from your authentication system
      setIsAdmin(adminStatus)
      if (!adminStatus) {
        router.push('/')
      }
    }
    checkAdminStatus()
  }, [router])

  if (!isAdmin) {
    return null // or a loading indicator
  }

  return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">后台管理</h1>
          <Tabs defaultValue="users">
            <TabsList>
              <TabsTrigger value="users">用户管理</TabsTrigger>
              <TabsTrigger value="posts">帖子管理</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            <TabsContent value="posts">
              <PostManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}

