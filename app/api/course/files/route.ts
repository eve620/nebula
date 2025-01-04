import {NextResponse} from "next/server";
import path from "path";
import * as fs from "fs";

export async function GET() {
    const folderPath = path.join(process.cwd(), 'scripts', 'courses');
    try {
        const jsonFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.json')).map(file => path.parse(file).name);
        return NextResponse.json(jsonFiles);
    } catch {
        // 如果发生错误，返回404
        throw new Error("服务器出错")
    }

}
