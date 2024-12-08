import prisma from "@/prisma/client";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {eventDataProps} from "@/app/(frontend)/kanban/page";
import {NextResponse} from "next/server";

export default async function getEventList() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return []
        let events = await prisma.event.findMany({
            where: {
                createdById: currentUser.id,
            }
        })
        return events.map((item) => {
            return {
                id: item.id,
                title: item.title,
                toDo: JSON.parse(item.toDo),
                inProgress: JSON.parse(item.inProgress),
                completed: JSON.parse(item.completed),
            }
        })
    } catch (error: any) {
        throw new Error(error);
    }
}
