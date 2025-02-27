import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {revalidateTag} from "next/cache";

export async function GET() {
    try {
        const data = await prisma.devLog.findMany({
            orderBy: {createdAt: 'asc'},
        })
        return NextResponse.json({data});
    } catch {
        // 如果发生错误，返回404
        throw new Error("服务器出错")
    }
}

export async function POST(request: NextRequest) {
    try {
        const {time, content, version, title} = await request.json()
        await prisma.notice.create({
            data: {
                time,
                content,
                version,
                title
            }
        });
        revalidateTag("notices")
        return NextResponse.json({message: "添加成功"});
    } catch {
        throw new Error("服务器出错")
    }
}
