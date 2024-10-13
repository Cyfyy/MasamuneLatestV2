import { connect } from "@/utils/config/dbConfig"
import User from "@/utils/models/auth"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials) {
                const { email, password } = credentials as {
                    email: string
                    password: string
                }
                try {
                    await connect();
                    const user = await User.findOne({ email })
                    if (!user) {
                        return null
                    }

                    const passwordMatch = await bcryptjs.compare(password, user.password)
                    if (!passwordMatch) {
                        return null
                    }
                    return user
                } catch (error) {
                    console.log("Error logging in:", error);
                }
            },
        }),
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
            }
            console.log(session)
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET!,
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error", // Error code passed in query string as ?error=
    },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };