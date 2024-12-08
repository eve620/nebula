import EditPage from "@/app/(container)/note/[id]/edit/EditPage";
import prisma from "@/prisma/client";
import EmptyState from "@/components/empty-state";
import getTagList from "@/app/actions/getTagList";

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
    const tagList: string[] = await getTagList() || []

    return (
        <EditPage tags={tagList} note={note}/>
    );
}

