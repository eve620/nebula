export interface User {
    id: number;
    username: string;
    nickname: string;
    bio: string;
    image: string;
    role: "Admin" | "User";
}

export interface EventType {
    id: number,
    title: string,
    toDo: string[],
    inProgress: string[],
    completed: string[]
}

export interface Notice {
    id: number,
    title: string,
    content: string;
    version: string;
    time: Date;
}

export interface Article {
    id: number;
    title: string;
    content: string;
    tags: string,
    createdById: number;
    createdAt: Date;
    updatedAt: Date;
    viewCount: number;
    isPinned: boolean;
    isLocked: boolean;
    visibility: "PRIVATE" | "PUBLIC",
    createdBy: {
        username: string;
        nickname: string; // 增加了nickname
    };
    _count: {
        likes: number
        comments: number
    }
}

export interface Project {
    id: number;
    title: string;
    job: string;
    stacks: string[],
    describe: string;
    startTime: Date;
    endTime: Date;
    highlight: string;
    imageUrl: string[];
    createdById: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: {
        username: string
        nickname: string
    }
}

export interface Tag {
    id: number,
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Friend {
    id: string;
    username: string;
    nickname:string;
    bio:string;
    image:string
}