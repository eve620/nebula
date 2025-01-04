import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
    try {
        const data = await prisma.project.findMany({
            where: {
                createdById: 1,
            }
        }
        )
        return NextResponse.json({data});
    } catch {
        // 如果发生错误，返回404
        throw new Error('服务器出错');
    }
}
