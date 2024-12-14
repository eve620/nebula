'use client'
import NoticePublish from "@/app/(container)/notice/notice-publish";
import NoticeList from "@/app/(container)/notice/notice-list";

export default function Notice() {
    const notice = [
        {
            id: '1',
            title: '绝区零最新版本更新',
            content: '新版本带来全新角色和任务系统，玩家可以体验更丰富的游戏内容。',
            author: '官方团队',
            date: '2023-06-20',
            imageUrl: '/placeholder.svg'
        },
        {
            id: '2',
            title: '年度电竞赛事即将开启',
            content: '年度绝区零电竞赛事将于下月举行，顶尖玩家将展开激烈对决。',
            author: '赛事组委会',
            date: '2023-06-18',
            imageUrl: '/placeholder.svg'
        },
    ]

    return (
        <>
            <h1 className="text-3xl font-bold mb-8">公告</h1>
            {/*发布公告表单*/}
            <NoticePublish/>
            {/* 公告列表 */}
            <NoticeList notice={notice}/>
        </>
    )
}

