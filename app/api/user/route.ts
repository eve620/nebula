import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {compare, hash} from "bcrypt";

export async function GET() {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "Admin") return NextResponse.json({error: '无权限'}, {status: 401});
    try {
        const users = await prisma.user.findMany()
        return NextResponse.json(users)
    } catch (e) {
        return NextResponse.json({error: '服务器内部错误'}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try {
        const {username, nickname, password} = await request.json()
        // 判断是否存在
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if (user) return NextResponse.json({error: "该账号已存在"}, {status: 409})
        // 创建新用户
        const hashedPassword = await hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                nickname,
                password: hashedPassword
            }
        })
        return NextResponse.json("")
    } catch (e) {
        return NextResponse.json({error: '服务器内部错误'}, {status: 500});
    }
}

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const username = formData.get("username") as string;
        const nickname = formData.get("nickname") as string;
        const bio = formData.get("bio") as string;
        const image = formData.get("image") as Blob;
        const oldPassword = formData.get("oldPassword") as string | null;
        const newPassword = formData.get("newPassword") as string | null;
        console.log(oldPassword)
        console.log(newPassword)
        const user = await prisma.user.findUnique({where: {username}});
        if (!user) {
            return NextResponse.json({error: "账号不存在"}, {status: 400});
        }
        let updatedPassword = user.password; // 默认不修改密码
        if (oldPassword || newPassword) {
            if (!oldPassword || !newPassword) return NextResponse.json({error: "请同时提供旧密码和新密码"}, {status: 400});
            const passwordCorrect = await compare(oldPassword, user.password);
            if (!passwordCorrect) {
                return NextResponse.json({error: "原密码不正确"}, {status: 400});
            }
            updatedPassword = await hash(newPassword, 10); // 更新密码
        }
        await prisma.user.update({
            where: {username},
            data: {
                nickname,
                bio,
                password: updatedPassword,
            },
        });
        return NextResponse.json({message: "修改成功"});
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: "服务器出错"}, {status: 500});
    }
}