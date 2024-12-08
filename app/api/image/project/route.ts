import {NextRequest, NextResponse} from "next/server";
import prisma from "@/prisma/client";
import {hash} from "bcrypt"

export async function POST(request: NextRequest) {

}

// async function handleImageUpload(req, res) {
//     const file = req.file;
//     if (!file) {
//         return res.status(400).json({ error: 'No file uploaded.' });
//     }
//
//     try {
//         // 计算图片相对路径（假设所有上传的图片都在 public/image 目录下）
//         const relativePath = `/image/${file.filename}`;
//         await fs.writeFile(savePath, file.buffer);
//         // 使用 Prisma 插入 Image 记录
//         const image = await prisma.image.create({
//             data: {
//                 filename: file.originalname,
//                 mimetype: file.mimetype,
//                 size: file.size,
//                 relativePath,
//             },
//         });
//
//         res.status(201).json(image);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to store the image.' });
//     }
// }