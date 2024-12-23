import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
    try {
        const data = await prisma.devLog.findMany()
        return NextResponse.json({data});
    } catch (error) {
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
        return NextResponse.json({message: "添加成功"});
    } catch (error) {
        throw new Error("服务器出错")
    }
}

export async function PUT(request: NextRequest) {

}