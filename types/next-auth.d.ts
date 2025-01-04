import { DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";

// 扩展默认的用户接口
declare module "next-auth" {
    interface User {
        username?: string;
        role?: string;
    }

    // 扩展默认的会话接口
    interface Session {
        user: DefaultSession["user"] & {
            username?: string;
            role?: string;
        };
    }
}

// 如果你还需要扩展 JWT，请这样做：
declare module "next-auth/jwt" {
    interface JWT {
        username?: string;
        role?: string;
    }
}