'use client'

import {useState, useEffect} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {toast} from "@/hooks/use-toast"
import {User} from "@/types";

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [newUser, setNewUser] = useState({username: '', email: '', role: '普通用户'})
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/user')
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
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            })
            if (!response.ok) {
                throw new Error('添加用户失败')
            }
            await fetchUsers()
            setNewUser({username: '', email: '', role: '普通用户'})
            toast({
                title: "成功",
                description: "用户添加成功",
            })
        } catch {
            toast({
                title: "错误",
                description: "添加用户失败",
                variant: "destructive",
            })
        }
    }

    const handleDeleteUser = async (id: number) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
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

    const handleEditUser = (user: User) => {
        setEditingUser(user)
        setIsEditModalOpen(true)
    }

    const handleSaveEdit = async () => {
        if (editingUser) {
            try {
                const response = await fetch(`/api/users/${editingUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
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
                    placeholder="邮箱"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
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
                                    <Button variant="destructive"
                                            onClick={() => handleDeleteUser(user.id)}>删除</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </>
                </TableBody>
            </Table>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>编辑用户</DialogTitle>
                    </DialogHeader>
                    <>
                        {editingUser && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        用户名
                                    </Label>
                                    <Input
                                        id="username"
                                        value={editingUser.username}
                                        onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="nickname" className="text-right">
                                        昵称
                                    </Label>
                                    <Input
                                        id="nickname"
                                        value={editingUser.nickname}
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
                                        value={editingUser.bio}
                                        onChange={(e) => setEditingUser({...editingUser, bio: e.target.value})}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="role" className="text-right">
                                        角色
                                    </Label>
                                    <Input
                                        id="role"
                                        value={editingUser.role}
                                        onChange={(e) => setEditingUser({
                                            ...editingUser,
                                            role: e.target.value === "Admin" ? "Admin" : "User"
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

