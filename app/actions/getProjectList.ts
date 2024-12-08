import prisma from "@/prisma/client";
import getCurrentUser from "@/app/actions/getCurrentUser";

export default async function getProjectList() {
    try {
        const currentUser = await getCurrentUser()
        const data = await prisma.project.findMany({
            where: {
                createdById: currentUser?.id || 1,
            }
        })
        return data.map(item => {
            return {
                id: item.id,
                title: item.title,
                startTime: item.startTime,
                endTime: item.endTime,
                job: item.job,
                stacks: item.stacks,
                describe: item.describe,
                highlight: item.highlight,
                imageUrl: item.imageUrl,
                createdById: item.createdById
            }
        })
    } catch (error: any) {
        throw new Error(error);
    }
}
