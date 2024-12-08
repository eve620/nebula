import Image from "next/image";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default function About() {
    return (
        <div>
            <h2 className="text-4xl font-bold mb-12 text-center">关于我</h2>
            <Card
                className="w-full mx-auto max-w-xl dark:bg-gray-950 dark:border-gray-800 shadow-lg dark:shadow-blue-950">
                <CardHeader className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Image src="/storage/avatar/avatar1.jpg" width={120} height={120} alt={"avatar"}
                           className={"rounded-full border-4 border-gray-200 z-10 shadow-lg"}/>
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold">suzvc</h2>
                        <p className="text-muted-foreground">西安电子科技大学</p>
                        <p className="text-muted-foreground">前端开发</p>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <div className="text-black text-center max-w-52 min-w-44 space-x-2 pt-4">
                        <span className="tag mb-3">#HTML</span>
                        <span className="tag mb-3">#CSS</span>
                        <span className="tag mb-3">#JS</span>
                        <span className="tag mb-3">#JQ</span>
                        <span className="tag mb-3">#bootstrap</span>
                        <span className="tag mb-3">#PR</span>
                        <span className="tag mb-3">#AE</span>
                        <span className="tag mb-3">#Vscode</span>
                    </div>
                    <div className="text-xl leading-9 float-left max-w-[380px] px-2">
                        Hello everyone, I am very glad to have the opportunity to introduce
                        myself to you. I have a strong interest in CSS and love sports...
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
