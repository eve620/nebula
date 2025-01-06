import {NextRequest, NextResponse} from 'next/server'
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function DELETE(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "Admin") return NextResponse.json({error: '无权限'}, {status: 401});
    try {
        const {id} = await request.json()
        await prisma.article.delete({
            where: {
                id: Number(id),
            }
        })
        return NextResponse.json({message: "删除成功"});
    } catch {
        throw new Error("删除错误")
    }
}



