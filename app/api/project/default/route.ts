import {NextRequest, NextResponse} from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
    try {
        const data = await prisma.project.findMany({
            where: {
                createdById: 1,
            }
        }
        )
        return NextResponse.json({data});
    } catch (error) {
        // 如果发生错误，返回404
        throw new Error('服务器出错');
    }
}
