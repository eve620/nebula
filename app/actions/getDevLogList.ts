import prisma from "@/prisma/client";
import getCurrentUser from "@/app/actions/getCurrentUser";

export default async function getDevLogList() {
    try {
        return await prisma.devLog.findMany()
    } catch (error: any) {
        throw new Error(error);
    }
}
