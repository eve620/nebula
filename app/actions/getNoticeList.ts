import {prisma} from "@/lib/prisma";
import {cache} from "react";

const getNoticeList = cache(async () => {
    try {
        return await prisma.notice.findMany({
            orderBy: {createdAt: 'asc'},
        });
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
});

export default getNoticeList