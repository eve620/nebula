import EnglishLayout from "@/app/english/component/EnglishLayout";
import getProgress from "@/app/actions/getProgress";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: "英语",
}

export default async function Page() {
    const progress = await getProgress()
    return (
        <div className="container px-4 py-8 mx-auto h-[calc(100vh-4rem)]">
            <EnglishLayout courseData={progress.courseData} wordIndex={progress.wordIndex}/>
        </div>
    )
}