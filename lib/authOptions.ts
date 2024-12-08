import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from "bcrypt"
import prisma from "@/prisma/client";

export const authOptions: NextAuthOptions = {
    session: {strategy: 'jwt'},
    pages: {signIn: "/login"},
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            credentials: {
                name: {},
                password: {},
            },

            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: {
                        account: credentials!.name
                    }
                })
                if (!user) return null
                const passwordCorrect = await compare(
                    credentials!.password || '',
                    user.password
                )
                if (passwordCorrect) return {id: String(user.id), name: user.account, image: user.image}
                return null
            }
        })
    ],
    // callbacks: {
    //     async jwt({user, token}) {
    //         if (user) {  // Note that this if condition is needed
    //             token.user = {...user}
    //         }
    //         return token
    //     },
    //     async session({session, token}) {
    //         if (token?.user) { // Note that this if condition is needed
    //             session.user = token.user;
    //         }
    //         return session
    //     },
    // },
}