import prisma from "@/prisma/client";
import getCurrentUser from "@/app/actions/getCurrentUser";

export default async function getNoteList() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return []
        let data = await prisma.note.findMany({
            where: {
                createdById: currentUser.id
            }
        })
        return data.map(item => {
            return {
                id: item.id,
                title: item.title,
                tags: item.tags,
                content: item.content,
                createdById: item.createdById
            }
        })
    } catch (error: any) {
        throw new Error(error);
    }
}
