import {NextRequest, NextResponse} from "next/server";
import {extractFormData} from "@/app/api/project/utils";
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {del, put} from "@vercel/blob";
import {v4 as uuid} from 'uuid'

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const id = Number(searchParams.get("id"))
    if (!id) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const data = await prisma.project.findMany({
            where: {
                createdById: id,
            }
        })
        return NextResponse.json({data});
    } catch {
        // 如果发生错误，返回404
        throw new Error('服务器出错')
    }
}

export async function POST(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const formData = await request.formData()
        const {
            title,
            job,
            stacks,
            startTime,
            endTime,
            describe,
            highlight,
            newImages,
        } = extractFormData(formData);
        const imageUrl = []
        for (const file of newImages) {
            const filename = uuid()
            const response = await put(`project/${filename}`, file, {
                access: 'public',
            })
            imageUrl.push(response.url)
        }
        await prisma.project.create({
            data: {
                title,
                job,
                stacks,
                startTime,
                endTime,
                describe,
                highlight,
                createdById: currentUser.id,
                imageUrl: JSON.stringify(imageUrl)
            }
        });

        return NextResponse.json({message: "添加成功"});
    } catch {
        throw new Error("服务器出错")
    }
}

export async function PUT(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const formData = await request.formData()
        const {
            title,
            job,
            stacks,
            startTime,
            endTime,
            describe,
            highlight,
            newImages,
            existingImages
        } = extractFormData(formData);
        const id = Number(formData.get("id"))
        if (id == undefined) {
            return NextResponse.json({message: "缺少项目ID"}, {status: 400});
        }
        const project = await prisma.project.findUnique({
            where: {
                id
            },
        });
        if (!project) {
            return NextResponse.json({message: "项目未找到"}, {status: 404});
        }
        const existingImageUrl = JSON.parse(project.imageUrl)
        for (const url of existingImageUrl) {
            if (!existingImages.includes(url)) {
                await del(url);
            }
        }

        for (const file of newImages) {
            const filename = uuid()
            const response = await put(`project/${filename}`, file, {
                access: 'public',
            })
            existingImages.push(response.url)
        }

        await prisma.project.update({
            where: {
                id
            },
            data: {
                title,
                job,
                stacks,
                startTime,
                endTime,
                describe,
                highlight,
                createdById: currentUser.id,
                imageUrl: JSON.stringify(existingImages)
            }
        });
        return NextResponse.json({message: "更新成功"});
    } catch {
        throw new Error("服务器出错")
    }
}


export async function DELETE(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: "未登录"}, {status: 401})

    try {
        const {id} = await request.json()

        if (!id) {
            return NextResponse.json({error: "缺少项目ID"}, {status: 400})
        }

        const project = await prisma.project.findUnique({
            where: {id},
        })

        if (!project) {
            return NextResponse.json({error: "项目未找到"}, {status: 404})
        }

        // 检查当前用户是否有权限删除这个项目
        if (project.createdById !== currentUser.id) {
            return NextResponse.json({error: "没有权限删除此项目"}, {status: 403})
        }

        // 删除相关的图片
        const imageUrls = JSON.parse(project.imageUrl)
        for (const url of imageUrls) {
            await del(url)
        }

        // 删除项目记录
        await prisma.project.delete({
            where: {id},
        })

        return NextResponse.json({message: "删除成功"})
    } catch (error) {
        console.error("删除项目时出错:", error)
        return NextResponse.json({error: "服务器出错"}, {status: 500})
    }
}
