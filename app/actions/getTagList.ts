import prisma from "@/prisma/client";
import getCurrentUser from "@/app/actions/getCurrentUser";

const defaultTag = "[]";

export default async function getTagList() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return []
        let tag = await prisma.tag.findUnique({
            where: {
                createdById: currentUser.id
            }
        })
        if (!tag) {
            tag = await prisma.tag.create({
                data: {
                    tags: '[]',
                    createdById: currentUser.id
                }
            })
        }
        return JSON.parse(tag.tags)
    } catch (error: any) {
        throw new Error(error);
    }
}
