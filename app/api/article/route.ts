import {NextRequest, NextResponse} from 'next/server'
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET() {
    console.log("2131312321")
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
    const body = await request.json()
    const {title, content, tags, createdById} = body
    const article = await prisma.article.create({
        data: {title, content, tags, createdById},
    })

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
        return NextResponse.json({message: "删除成功"});
    } catch (error) {
        console.log(error)
        throw new Error("删除错误")
    }
}



