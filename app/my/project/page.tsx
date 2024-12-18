import getProjectList from "@/app/actions/getProjectList";
import ProjectList from "@/app/my/project/ProjectList";

export type Project = {
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    job: string;
    stacks: string;
    describe: string;
    highlight: string;
    imageUrl: string;
    createdById: number;
}
export default async function Page() {
    const projectList: Project[] = await getProjectList() || []
    return (
        <ProjectList projectList={projectList}/>
    );
}
