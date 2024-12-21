import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from "bcrypt"
import {prisma} from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    session: {strategy: 'jwt'},
    pages: {signIn: "/login"},
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            credentials: {
                username: {},
                password: {},
            },

            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials!.username
                    }
                })
                if (!user) return null
                const passwordCorrect = await compare(
                    credentials!.password || '',
                    user.password
                )
                if (passwordCorrect) return user
                return null
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.username = user.username
                token.role = user.role
            }
            return token;
        },
        async session({session, token}) {
            session.user = {username: token.username};
            return session;
        }
    }
}