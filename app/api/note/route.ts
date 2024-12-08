import {NextRequest, NextResponse} from "next/server";
import prisma from "@/prisma/client";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    const {searchParams} = new URL(request.url);
    const id = searchParams.get("id");
    try {
        if (id) {
            // 获取特定 note
            const data = await prisma.note.findUnique({
                where: {
                    id: Number(id),
                }
            });
            return NextResponse.json({data});
        } else {
            const data = await prisma.note.findMany({
                where: {
                    createdById: currentUser.id
                }
            })
            return NextResponse.json({data})
        }
    } catch (error) {
        return NextResponse.json({message: '查询失败'});
    }
}

export async function POST(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const {title, tags, content} = await request.json()
        const note = await prisma.note.create({
            data: {
                title,
                tags,
                content,
                createdById: currentUser.id
            }
        })
        return NextResponse.json({message: "添加成功"});
    } catch (error) {
        return NextResponse.json({message: '添加失败'});
    }
}

export async function PUT(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const {id, title, tags, content} = await request.json()
        const note = await prisma.note.update({
            where: {
                id: Number(id)
            },
            data: {
                title,
                tags,
                content,
                createdById: currentUser.id
            }
        })
        return NextResponse.json({message: "编辑成功"});
    } catch (error) {
        return NextResponse.json({message: '编辑失败'});
    }
}

export async function DELETE(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const {id} = await request.json()
        await prisma.note.delete({
            where: {
                id: Number(id)
            }
        })
        return NextResponse.json({message: "删除成功"});
    } catch (error) {
        console.log(error)
        throw new Error("删除错误")
    }
}

