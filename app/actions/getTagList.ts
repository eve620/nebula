import {prisma} from "@/lib/prisma";
import {unstable_cache} from "next/cache";

const getTagList = unstable_cache(
    async () => {
        try {
            const tag = await prisma.tag.findMany()
            const tagArray = tag.map((item) => item.content)
            return tagArray || []
        } catch (error) {
            throw new Error(error);
        }
    },
    ["tag-list"],
    // 配置选项
    {
        tags: ["tags"], // 用于手动失效的标签
    },
)

export default getTagList