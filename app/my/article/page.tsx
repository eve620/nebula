import Articles from "@/app/my/article/Articles";
import getArticleList from "@/app/actions/getArticleList";
import {Article} from "@/types";

export default async function Page() {
    const articles: Article[] = await getArticleList() || []
    return (
        <Articles articles={articles}/>
    );
}

