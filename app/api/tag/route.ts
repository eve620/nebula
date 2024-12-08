import {NextRequest, NextResponse} from "next/server";
import prisma from "@/prisma/client";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const tag = await prisma.tag.findUnique({
            where: {
                id: currentUser.id
            }
        })
        if (!tag) return NextResponse.json({error: '查询失败'}, {status: 404});
        return NextResponse.json({tag});
    } catch (error) {
        // 如果发生错误，返回404
        throw new Error("服务器出错")
    }
}

export async function PUT(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const tags = await request.json()
        const tag = await prisma.tag.findUnique({
            where: {
                id: currentUser.id
            }
        })
        if (!tag) NextResponse.json({error: '查询失败'}, {status: 404});
        await prisma.tag.update({
            where: {
                createdById: currentUser.id
            },
            data: {
                tags: JSON.stringify(tags)
            }
        })
        return NextResponse.json({message: "更新成功"});
    } catch (error) {
        throw new Error("服务器出错")
    }
}