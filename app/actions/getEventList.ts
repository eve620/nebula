import getCurrentUser from "@/app/actions/getCurrentUser";
import {prisma} from "@/lib/prisma";

export default async function getEventList() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return []
        const events = await prisma.event.findMany({
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
    } catch  {
        throw new Error;
    }
}
