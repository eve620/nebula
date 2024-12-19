import {prisma} from "@/lib/prisma";

export default async function getNoticeList() {
    try {
        return await prisma.notice.findMany()
    } catch (error) {
        throw new Error(error);
    }
}
