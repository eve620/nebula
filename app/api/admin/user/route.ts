import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {hash} from "bcrypt";

export async function GET() {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "Admin") return NextResponse.json({error: '无权限'}, {status: 401});
    try {
        const users = await prisma.user.findMany()
        return NextResponse.json(users)
    } catch {
        return NextResponse.json({error: '服务器内部错误'}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "Admin") return NextResponse.json({error: '无权限'}, {status: 401});
    try {
        const {username, password} = await request.json()
        // 判断是否存在
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if (user) return NextResponse.json({error: "该账号已存在"}, {status: 409})
        // 创建新用户
        const hashedPassword = await hash(password, 10);
        await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });
        return NextResponse.json("添加成功")
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: '服务器内部错误'}, {status: 500});
    }
}

export async function PUT(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "Admin") return NextResponse.json({error: '无权限'}, {status: 401});
    try {
        const {username, nickname, bio, role, newPassword} = await request.json()
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if (!user) return NextResponse.json({error: "无用户"}, {status: 404});
        let updatedPassword = user.password; // 默认不修改密码
        if (newPassword) {
            updatedPassword = await hash(newPassword, 10); // 更新密码
        }

        await prisma.user.update({
            where: {username},
            data: {
                nickname,
                bio,
                role: role === "Admin" ? "Admin" : "User",
                password: updatedPassword,
            },
        });
        return NextResponse.json({message: "修改成功"});
    } catch {
        return NextResponse.json({error: "服务器出错"}, {status: 500});
    }
}

export async function DELETE(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "Admin") return NextResponse.json({error: '无权限'}, {status: 401});
    const {id} = await request.json()
    try {
        await prisma.user.delete({where: {id}})
        // const users = await prisma.user.findMany()
        return NextResponse.json({message: "删除成功"})
    } catch {
        return NextResponse.json({error: '服务器内部错误'}, {status: 500});
    }
}