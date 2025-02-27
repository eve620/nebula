import Image from "next/image";
import Link from "next/link";
import React from "react";

const Guide: React.FC = () => {
    return (
        <div className={'sm:columns-2 max-w-6xl mx-auto'}>
            <div className="overflow-hidden">
                <Image className={"mx-auto mt-2 rounded-md"} width={150} height={150}
                       src={"/storage/avatar/avatar1.jpg"}
                       loading={'lazy'}
                       alt={"picture"}/>
                <p className={"text-center text-xl leading-loose font-semibold"}>开始使用Nebula</p>
                <p className={"text-center text leading-loose font-semibold"}>探索知识的宇宙</p>
                <Link className="
                    w-full py-2 mt-5 mx-auto sm:w-48 text-center rounded-md font-bold hover:duration-200 block
                    text-black dark:text-gray-300
                    bg-gray-200 dark:bg-neutral-800
                    hover:bg-gray-300 dark:hover:bg-neutral-900" target={"_blank"}
                      href={"https://github.com/eve620"}>Github</Link>
            </div>
            <div>
                <div className="overflow-hidden
                                bg-gray-50 border border-gray-200 dark:border-gray-500
                                dark:from-[#525252e6] dark:bg-gradient-to-b dark:to-gray-900
                                rounded-2xl p-4 hover:duration-200
                                hover:shadow-lg dark:shadow-md dark:hover:shadow-slate-700/70
                                ">
                    <div className="pr-2">
                        <section>
                            <h2 className="text-xl font-bold mb-4">欢迎来到Nebula🌟</h2>
                            <p className="text-sm leading-relaxed mb-8">
                                Nebula是一款致力于个人开发的学习与知识分享平台。
                                加入我们，一起分享学习心得，记录项目历程，提升英语水平，管理待办事项。
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-2">知识分享与交流</h3>
                            <p className="text-sm leading-relaxed mb-4">
                                总结自己的学习经验，点赞和评论他人的文章，并分享给好友~
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-2">互动与社交</h3>
                            <p className="text-sm leading-relaxed mb-4">
                                在这里，您可以轻松添加好友，共享精彩文章，实时交流，让学习之路不再孤单。
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-2">每日打卡与排行📅</h3>
                            <p className="text-sm leading-relaxed mb-4">
                                每天打卡，记录您的学习进展，通过持续的努力提高自己的排名，见证自己的成长。
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-2">英语与待办事项</h3>
                            <p className="text-sm leading-relaxed mb-4">
                                每日一点点，学习英语并推进自己的学习进度吧。
                                如果没有登录，数据会存储在浏览器中哦。
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Guide