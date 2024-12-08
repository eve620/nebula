import ContentPage from "@/app/(container)/note/[id]/ContentPage";
import prisma from "@/prisma/client";
import EmptyState from "@/components/empty-state";

interface Props {
    params: { id: string }
}

export default async function Page({params}: Props) {
    const note = await prisma.note.findUnique({
        where: {
            id: Number(params.id)
        }
    })
    if (!note) {
        return <EmptyState/>
    }
    return (
        <ContentPage note={note}/>
    )
}