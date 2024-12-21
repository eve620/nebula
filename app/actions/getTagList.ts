import {prisma} from "@/lib/prisma";

export default async function getTagList() {
    try {
        const tag = await prisma.tag.findMany()
        const tagArray = tag.map((item) => item.content)
        return tagArray || []
    } catch (error: any) {
        throw new Error(error);
    }
}
