import Link from "next/link";
import {Github} from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-muted text-center py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="text-xl font-bold mb-4">关于我</div>
                        <p className="text-muted-foreground">一个热爱技术的开发者，专注于前端与全栈开发。</p>
                    </div>
                    <div>
                        <div className="text-xl font-bold mb-5">快速链接</div>
                        <ul className="flex justify-center space-x-4">
                            <li><Link href={"/forum"}
                                      className="text-muted-foreground hover:text-foreground">论坛</Link></li>
                            <li><Link href={"/english"}
                                      className="text-muted-foreground hover:text-foreground">英语</Link>
                            </li>
                            <li><Link href={"/kanban"}
                                      className="text-muted-foreground hover:text-foreground">代办</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div className="text-xl font-bold mb-4">关注我</div>
                        <div className="flex justify-center space-x-4 mb-4">
                            <Link href={"https://gitee.com/suzvc"} target={"_blank"}
                                  className="text-muted-foreground hover:text-foreground">
                                <span className="sr-only">Gitee</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 1024 1024">
                                    <path
                                        d="M850.016 438.016H471.008q-14.016 0-23.488 9.504t-9.504 23.488v82.016q0 14.016 9.504 23.488t23.488 9.504h230.016q14.016 0 23.488 9.504t9.504 23.488v16.992q0 19.008-7.488 37.504t-20.992 32-32 20.992-37.504 7.488h-314.016q-12.992 0-23.008-9.504t-10.016-23.488v-312.992q0-19.008 8-37.504t21.504-32 32-20.992 37.504-7.488h462.016q12.992 0 23.008-10.016t10.016-23.008V173.984q0-12.992-10.016-23.008t-23.008-10.016H388q-67.008 0-123.488 33.504T174.496 264.48t-33.504 123.488v462.016q0 12.992 10.016 23.008t23.008 10.016h486.016q44.992 0 85.504-16.992t72-48.512 48.512-72 16.992-85.504v-188.992q0-14.016-10.016-23.488t-23.008-9.504z"
                                    ></path>
                                </svg>
                            </Link>

                            <Link href={"https://github.com/eve620"} target={"_blank"}
                                  className="text-muted-foreground hover:text-foreground">
                                <span className="sr-only">GitHub</span>
                                <Github/>
                            </Link>
                        </div>
                        <p className={'text-muted-foreground'}>联系我：121121620@qq.com</p>
                    </div>
                </div>
                <p className="mt-8 text-muted-foreground">&copy; 2024-2025 NABULA. All rights reserved.</p>
                <p className="text-muted-foreground text-xs">本项目当前为个人开发，未来可能以开源形式发布</p>
            </div>
        </footer>
    )
}

