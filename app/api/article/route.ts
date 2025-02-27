import {NextRequest, NextResponse} from 'next/server'
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {revalidateTag} from "next/cache";

export async function GET() {
    const articles = await prisma.article.findMany({
        include: {
            createdBy: {select: {nickname: true, username: true}},
            _count: {select: {likes: true}},
            comments: true
        },
        orderBy: {createdAt: 'desc'},
    })
    return NextResponse.json(articles)
}

export async function POST(request: Request) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    const {title, content, tags} = await request.json()
    const article = await prisma.article.create({
        data: {title, content, tags, createdById: currentUser.id},
    })
    if (article) {
        revalidateTag("article" + article.id)
    }
    return NextResponse.json(article, {status: 201})
}

export async function PUT(request: Request) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    const {id, title, content, tags, visibility} = await request.json()
    if (visibility) {
        await prisma.article.update({
            where: {
                id
            },
            data: {visibility},
        })
        return NextResponse.json("修改成功", {status: 201})
    }
    const article = await prisma.article.update({
        where: {
            id
        },
        data: {title, content, tags, createdById: currentUser.id},
    })
    if (article) {
        revalidateTag("article" + article.id)
    }

    return NextResponse.json(article, {status: 201})
}

export async function DELETE(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const {id} = await request.json()
        await prisma.article.delete({
            where: {
                id: Number(id),
                createdById: currentUser.id
            }
        })
        revalidateTag("article" + id)

        return NextResponse.json({message: "删除成功"});
    } catch {
        throw new Error("删除错误")
    }
}



