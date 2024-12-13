export interface User {
    id: string;
    username: string;
    nickname: string;
    bio: string;
    image: string;
    role: "Admin"|"User";
}