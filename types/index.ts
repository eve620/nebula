export interface User {
    id: string;
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
    visibility: "PRIVATE" | "FRIENDS_ONLY" | "PUBLIC",
    createdBy: {
        username: string;
        nickname: string; // 增加了nickname
    };
    comments: any;
    _count: {
        likes: number
    }
}

export interface Tag {
    id: number,
    content: string;
    createdAt: Date;
    updatedAt: Date;
}