'use client'

import React, {useState, useEffect} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {toast} from "@/hooks/use-toast"
import {User} from "@/types";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [newUser, setNewUser] = useState({username: '', password: '', role: 'User'})
    const [editingUser, setEditingUser] = useState()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/user')
            if (!response.ok) {
                throw new Error('获取用户列表失败')
            }
            const data = await response.json()
            setUsers(data)
        } catch {
            toast({
                title: "错误",
                description: "获取用户列表失败",
                variant: "destructive",
            })
        }
    }

    const handleAddUser = async () => {
        if (newUser.password === "" || newUser.username === "") {
            toast({
                title: "错误",
                description: "用户名和密码不能为空",
                variant: "destructive",
            })
            return
        }
        const response = await fetch('/api/admin/user', {
            method: 'POST',
            body: JSON.stringify(newUser),
        })
        if (!response.ok) {
            const res = await response.json()
            toast({
                title: "错误",
                description: res.error,
                variant: "destructive",
            })
            return
        }
        await fetchUsers()
        setNewUser({username: '', password: '', role: 'User'})
        toast({
            title: "成功",
            description: "用户添加成功",
        })
    }

    const handleDeleteUser = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/user`, {
                method: 'DELETE',
                body: JSON.stringify({
                    id
                })
            })
            if (!response.ok) {
                throw new Error('删除用户失败')
            }
            await fetchUsers()
            toast({
                title: "成功",
                description: "用户删除成功",
            })
        } catch {
            toast({
                title: "错误",
                description: "删除用户失败",
                variant: "destructive",
            })
        }
    }

    const handleEditUser = (user) => {
        setEditingUser(user)
        setIsEditModalOpen(true)
    }

    const handleSaveEdit = async () => {
        if (editingUser) {
            try {
                const response = await fetch(`/api/admin/user`, {
                    method: 'PUT',
                    body: JSON.stringify(editingUser),
                })
                if (!response.ok) {
                    throw new Error('更新用户失败')
                }
                await fetchUsers()
                setIsEditModalOpen(false)
                setEditingUser(null)
                toast({
                    title: "成功",
                    description: "用户更新成功",
                })
            } catch {
                toast({
                    title: "错误",
                    description: "更新用户失败",
                    variant: "destructive",
                })
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <Input
                    placeholder="用户名"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                />
                <Input
                    placeholder="密码"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
                <Button onClick={handleAddUser}>添加用户</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>用户名</TableHead>
                        <TableHead>昵称</TableHead>
                        <TableHead>简介</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.nickname}</TableCell>
                                <TableCell>{user.bio}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button variant="outline" className="mr-2"
                                            onClick={() => handleEditUser(user)}>编辑</Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button>删除</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    此操作无法撤消。这将永久删除用户，且无法恢复。
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>取消</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteUser(user.id)}>确认删除</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </>
                </TableBody>
            </Table>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent aria-description={"编辑用户"}>
                    <DialogHeader>
                        <DialogTitle>编辑用户</DialogTitle>
                        <DialogDescription>
                            输入信息以编辑用户
                        </DialogDescription>
                    </DialogHeader>
                    <>
                        {editingUser && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right text-muted-foreground">
                                        用户名
                                    </Label>
                                    <Input
                                        disabled={true}
                                        id="username"
                                        value={editingUser.username}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="nickname" className="text-right">
                                        昵称
                                    </Label>
                                    <Input
                                        id="nickname"
                                        value={editingUser.nickname || ""}
                                        onChange={(e) => setEditingUser({...editingUser, nickname: e.target.value})}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="bio" className="text-right">
                                        简介
                                    </Label>
                                    <Input
                                        id="bio"
                                        value={editingUser.bio || ""}
                                        onChange={(e) => setEditingUser({...editingUser, bio: e.target.value})}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="role" className="text-right">
                                        角色
                                    </Label>
                                    <Select value={editingUser.role}
                                            onValueChange={(value) => setEditingUser({...editingUser, role: value})}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="请选择权限"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="User">普通用户</SelectItem>
                                                <SelectItem value="Admin">管理员</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="role" className="text-right">
                                        新密码
                                    </Label>
                                    <Input
                                        id="role"
                                        onChange={(e) => setEditingUser({
                                            ...editingUser,
                                            newPassword: e.target.value
                                        })}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                        )}
                    </>
                    <DialogFooter>
                        <Button onClick={handleSaveEdit}>保存</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

