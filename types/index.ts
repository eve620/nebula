export interface User {
    id: string;
    username: string;
    nickname: string;
    bio: string;
    image: string;
    role: "Admin" | "User";
}

export interface Note {
    id: number,
    title: string,
    tags: string,
    content: string,
    createdById: number
}

export interface EventType {
    id: number,
    title: string,
    toDo: string[],
    inProgress: string[],
    completed: string[]
}

export interface Post {
    id: number;
    title: string;
    content: string;
    createdById: number;
    createdAt: Date;
    updatedAt: Date;
    viewCount: number;
    isPinned: boolean;
    isLocked: boolean;
    createdBy: {
        username: string;
        nickname: string; // 增加了nickname
    };
    comments: any;
    _count: {
        likes: number
    }
}