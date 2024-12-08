import EnglishLayout from "@/app/(container)/english/component/EnglishLayout";
import getProgress from "@/app/actions/getProgress";

export default async function Page() {
    const progress = await getProgress()
    return (
        <EnglishLayout courseData={progress.courseData} wordIndex={progress.wordIndex}/>
    )
}