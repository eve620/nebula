import Image from "next/image";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default function About() {
    return (
        <div>
            <h2 className="text-4xl font-bold mb-12 text-center">关于我</h2>
            <Card
                className="w-full mx-auto max-w-xl bg-card/70 shadow-lg dark:shadow-slate-700">
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
                    <div className=" text-center max-w-52 min-w-44 space-x-2 pt-4">
                        <span className="tag mb-3">#HTML</span>
                        <span className="tag mb-3">#CSS</span>
                        <span className="tag mb-3">#Javascript</span>
                        <span className="tag mb-3">#React</span>
                        <span className="tag mb-3">#Vue</span>
                        <span className="tag mb-3">#Web</span>
                    </div>
                    <div className="indent-6 text-sm leading-9 float-left max-w-[380px] px-2">
                        <p>
                            我是一名来自西安的前端开发者，目前在读研二，喜欢开发好看、有意思的页面。
                        </p>
                        <p>
                            开发这个网站的初衷是为了学习一些B端开发的知识，在开发功能的过程中逐渐加入了一些自己平常学习中用的上的一些功能，希望可以创造一个即简约又实用的学习网站...
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
