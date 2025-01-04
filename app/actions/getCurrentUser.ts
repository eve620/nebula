import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import {prisma} from "@/lib/prisma";

interface Session {
    user: {
        username: string
    }
}

const getCurrentUser = async () => {
    try {
        const session: Session | null = await getServerSession(authOptions)
        if (!session?.user?.username) {
            return null;
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                username: session.user.username,
            }
        });

        if (!currentUser) {
            return null;
        }
        return {
            id: currentUser.id,
            username: currentUser.username,
            nickname: currentUser.nickname,
            bio: currentUser.bio,
            image: currentUser.image,
            role: currentUser.role
        };
    } catch  {
        throw new Error();
    }
}

export default getCurrentUser