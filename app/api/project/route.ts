import {NextRequest, NextResponse} from "next/server";
import {deleteFiles, extractFormData, saveFiles} from "@/app/api/project/utils";
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {put} from "@vercel/blob";
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
    } catch (error) {
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
            existingImages
        } = extractFormData(formData);
        console.log(newImages)
        const imageUrl = []
        for (let file of newImages) {
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
    } catch (error) {
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
        const uploadedImage = JSON.parse(formData.get("uploadedImage") as string);
        if (id == undefined) {
            return NextResponse.json({message: "缺少项目ID"}, {status: 400});
        }
        const imageUrl = []
        for (let file of newImages) {
            const filename = uuid()
            const response = await put(`project/${filename}`, file, {
                access: 'public',
            })
            imageUrl.push(response.url)
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
        //todo:删除
        // const filesToDelete = existingImageUrl.filter(item => !newImageUrl.includes(item));
        // await deleteFiles(filesToDelete);
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
                createdById,
                imageUrl: JSON.stringify(newImageUrl)
            }
        });
        return NextResponse.json({message: "更新成功"});
    } catch (error) {
        // 如果发生错误，返回404
        throw new Error("服务器出错")
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = await request.json()

        const project = await prisma.project.findUnique({
            where: {
                id
            }
        });
        if (!project) return NextResponse.json({error: "未找到项目"}, {status: 404});
        const filesToDelete = JSON.parse(project.imageUrl)
        await deleteFiles(filesToDelete);
        await prisma.project.delete({
            where: {
                id
            }
        })
        return NextResponse.json({message: "删除成功"});
    } catch (error) {
        throw new Error("服务器出错")
    }
}
