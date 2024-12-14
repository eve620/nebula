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

export interface Tag {
    id: string;
    username: string;
    nickname: string;
    bio: string;
    image: string;
    role: "Admin" | "User";
}