import {NextRequest, NextResponse} from "next/server";
import path from "path";
import * as fs from "fs";

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url)
    const id = searchParams.get('id')

    // 构建静态文件路径
    const filePath = path.join(process.cwd(), 'scripts', 'courses', `${id}.json`);

    try {
        // 读取JSON文件内容
        const jsonData = fs.readFileSync(filePath, 'utf8');

        // 将JSON内容发送给客户端
        return NextResponse.json({id, title: `Lesson ${id}`, statements: JSON.parse(jsonData)});
    } catch {
        // 如果发生错误，返回404
        throw new Error("服务器出错")
    }
}
