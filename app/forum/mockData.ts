export interface Comment {
    id: number;
    createdBy: {
        image: string
        username: string
        nickname: string
    };
    content: string;
    createdAt: Date;
    childComments: ChildComment[];
}

export interface ChildComment {
    id: number;
    createdBy: {
        image: string
        username: string
        nickname: string
    };
    content: string;
    replyTo?: string
    createdAt: Date;
}
