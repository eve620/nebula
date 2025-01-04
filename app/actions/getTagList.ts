import {prisma} from "@/lib/prisma";

export default async function getTagList() {
    try {
        const tag = await prisma.tag.findMany()
        const tagArray = tag.map((item) => item.content)
        return tagArray || []
    } catch (error) {
        throw new Error(error);
    }
}
