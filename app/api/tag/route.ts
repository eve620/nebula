import {NextRequest, NextResponse} from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {prisma} from "@/lib/prisma";
import {revalidateTag} from "next/cache";

export async function GET() {
    try {
        const tag = await prisma.tag.findMany()
        const tagArray = tag.map((item) => item.content)
        return NextResponse.json(tagArray || []);
    } catch {
        throw new Error("服务器出错")
    }
}

export async function PUT(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "Admin") return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const hadTag = await prisma.tag.findMany()
        const hadTagArray = hadTag.map((item) => item.content)
        const tags = await request.json()
        for (const item of tags) {
            if (hadTagArray.includes(item)) continue
            await prisma.tag.create({
                data: {
                    content: item
                }
            });
        }
        revalidateTag("tags")
        return NextResponse.json({message: "更新成功"});
    } catch {
        throw new Error("服务器出错")
    }
}

export async function DELETE(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "Admin") return NextResponse.json({error: '权限不足'}, {status: 403});
    try {
        const tag = await request.json()
        await prisma.tag.delete({
            where: {
                content: tag
            }
        })
        revalidateTag("tags")
        return NextResponse.json("删除成功");
    } catch {
        throw new Error("服务器出错")
    }
}