import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {UserManagement} from '@/components/admin/user-management'
import {ArticleManagement} from '@/components/admin/article-management'
import {TagManagement} from "@/components/admin/tag-management";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: "后台",
}
export default function AdminDashboard() {
    return (
        <div className="bg-background text-foreground">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">后台管理</h1>
                <Tabs defaultValue="users">
                    <TabsList>
                        <TabsTrigger value="users">用户管理</TabsTrigger>
                        <TabsTrigger value="articles">文章管理</TabsTrigger>
                        <TabsTrigger value="tags">标签管理</TabsTrigger>
                    </TabsList>
                    <TabsContent value="users">
                        <UserManagement/>
                    </TabsContent>
                    <TabsContent value="articles">
                        <ArticleManagement/>
                    </TabsContent>
                    <TabsContent value="tags">
                        <TagManagement/>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

