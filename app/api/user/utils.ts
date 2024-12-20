import path from "path";
import fs from "fs";
import {NextResponse} from "next/server";

const AVATAR_DIR = path.join(process.cwd(), 'public', 'storage', 'avatar');

export async function saveBase64Image(base64Image): Promise<string> {
    const matches = base64Image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]*);base64,/);
    const mimeType = matches[1];
    const extension = mimeType.split('/')[1];
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `${Date.now()}.${extension}`;
    const filePath = path.join(AVATAR_DIR, fileName);
    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            return NextResponse.json({error: '头像存储错误'}, {status: 500});
        }
    });
    return fileName;
}