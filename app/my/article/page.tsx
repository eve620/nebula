import Articles from "@/app/my/article/Articles";
import {Article} from "@/types";
import getMyArticleList from "@/app/actions/getMyArticleList";
import getTagList from "@/app/actions/getTagList";
import {TagProvider} from "@/contexts/tag-context";
import React from "react";

export default async function Page() {
    const articles: Article[] = await getMyArticleList() || []
    const tagList: string[] = await getTagList()
    return (
        <TagProvider value={tagList}>
            <Articles articles={articles}/>
        </TagProvider>
    );
}

