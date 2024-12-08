import {NextRequest, NextResponse} from "next/server";
import prisma from "@/prisma/client";
import {deleteFiles, extractFormData, saveFiles} from "@/app/api/project/utils";

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
            createdById,
            files
        } = extractFormData(formData);
        const imageUrl = await saveFiles(files);

        await prisma.project.create({
            data: {
                title,
                job,
                stacks,
                startTime,
                endTime,
                describe,
                highlight,
                createdById,
                imageUrl: JSON.stringify(imageUrl)
            }
        });

        return NextResponse.json({message: "添加成功"});
    } catch (error) {
        throw new Error("服务器出错")
    }
}

export async function PUT(request: NextRequest) {
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
            createdById,
            files,
        } = extractFormData(formData);
        const id = Number(formData.get("id"))
        const uploadedImage = JSON.parse(formData.get("uploadedImage") as string);
        if (id == undefined) {
            return NextResponse.json({message: "缺少项目ID"}, {status: 400});
        }
        const imageUrl = await saveFiles(files);
        const newImageUrl = [...uploadedImage, ...imageUrl];

        const project = await prisma.project.findUnique({
            where: {
                id
            },
        });
        if (!project) {
            return NextResponse.json({message: "项目未找到"}, {status: 404});
        }

        const existingImageUrl = JSON.parse(project.imageUrl)
        const filesToDelete = existingImageUrl.filter(item => !newImageUrl.includes(item));
        await deleteFiles(filesToDelete);
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
