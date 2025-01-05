import Articles from "@/app/my/article/Articles";
import {Article} from "@/types";
import getMyArticleList from "@/app/actions/getMyArticleList";

export default async function Page() {
    const articles: Article[] = await getMyArticleList() || []
    return (
        <Articles articles={articles}/>
    );
}

