import prisma from "@/prisma/client";
import getCurrentUser from "@/app/actions/getCurrentUser";
import path from "path";
import fs from "fs";

export default async function getProgress() {
    try {
        const currentUser = await getCurrentUser()
        let wordIndex = 0
        let courseData
        if (currentUser) {
            let progress = await prisma.progress.findFirst({
                where: {
                    createdById: currentUser.id
                }
            })
            if (!progress) {
                progress = await prisma.progress.create({
                    data: {
                        createdBy: {connect: {id: Number(currentUser.id)}},
                        course: "01",
                        wordIndex: 0
                    }
                })
            }
            wordIndex = progress.wordIndex
            const courseId = progress.course;
            const filePath = path.join(process.cwd(), 'scripts', 'courses', `${courseId}.json`);
            // 读取JSON文件内容
            const jsonData = fs.readFileSync(filePath, 'utf8');
            courseData = {id: courseId, title: `Lesson ${courseId}`, statements: JSON.parse(jsonData)}
        } else {
            // 构建静态文件路径
            const filePath = path.join(process.cwd(), 'scripts', 'courses', '01.json');
            // 读取JSON文件内容
            const jsonData = fs.readFileSync(filePath, 'utf8');
            courseData = {id: '01', title: 'Lesson 01', statements: JSON.parse(jsonData)}
        }
        return {wordIndex, courseData}
    } catch (error: any) {
        throw new Error(error);
    }
}
