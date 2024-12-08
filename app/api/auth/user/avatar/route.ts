import {NextRequest, NextResponse} from "next/server";
import prisma from "@/prisma/client";
import fs from "fs";
import path from "path";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {saveBase64Image} from "@/app/api/auth/user/utils";

const AVATAR_DIR = path.join(process.cwd(), 'public', 'storage', 'avatar');

export async function PUT(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return NextResponse.json({error: "未登录"}, {status: 400})
        const {base64Image} = await request.json()
        if (base64Image) {
            if (currentUser.image) {
                const deleteFilePath = path.join(AVATAR_DIR, currentUser.image);
                fs.unlink(deleteFilePath, (err) => {
                    if (err) {
                        return NextResponse.json({error: '删除文件时出错', details: err.message}, {status: 500});
                    }
                    return NextResponse.json({message: '文件删除成功'}, {status: 200});
                });
            }
            const matches = base64Image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]*);base64,/);
            if (!matches) {
                return NextResponse.json({error: '无效的图片'}, {status: 400});
            }
            const fileName = await saveBase64Image(base64Image)
            await prisma.user.update({
                where: {account: currentUser.account},
                data: {image: fileName}
            })
            return NextResponse.json({message: "修改成功"})
        }
        return NextResponse.json({error: "无效头像"}, {status: 400})
    } catch (e) {
        throw new Error("服务器出错")
    }
}
