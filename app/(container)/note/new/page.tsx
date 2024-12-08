import NewPage from "@/app/(container)/note/new/NewPage";
import getTagList from "@/app/actions/getTagList";

export default async function Page() {
    const tagList: string[] = await getTagList() || []

    return (
        <NewPage tags={tagList}/>
    )
}

