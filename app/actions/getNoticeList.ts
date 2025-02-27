import {unstable_cache} from "next/cache"
import {prisma} from "@/lib/prisma"

// 使用 unstable_cache 包装你的数据库查询函数
const getNoticeList = unstable_cache(
    async () => {
        try {
            return await prisma.notice.findMany({
                orderBy: {createdAt: "asc"},
            })
        } catch (error) {
            throw new Error(error)
        }
    },
    // 缓存键，用于唯一标识此查询
    ["notice-list"],
    // 配置选项
    {
        tags: ["notices"], // 用于手动失效的标签
    },
)

export default getNoticeList