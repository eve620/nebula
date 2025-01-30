import {prisma} from "@/lib/prisma";

export default async function getNoticeList() {
    try {
        return await prisma.notice.findMany({
            orderBy: {createdAt: 'asc'},
        })
    } catch (error) {
        throw new Error(error);
    }
}
