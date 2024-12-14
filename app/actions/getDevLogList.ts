import prisma from "@/prisma/client";

export default async function getDevLogList() {
    try {
        return await prisma.devlog.findMany()
    } catch (error: any) {
        throw new Error(error);
    }
}
