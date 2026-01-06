import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/password`, {
                    method: "POST",
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password
                    }),
                    headers: { "Content-Type": "application/json" }
                });

                const data = await res.json();
                
                if (res.ok && data.token) {
                    const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`, {
                        headers: { Authorization: `Bearer ${data.token}` }
                    });

                    const userData = await profileRes.json();
                    
                    return {
                        id: userData.user.id,
                        name: userData.user.name,
                        email: userData.user.email,
                        role: userData.user.role,
                        isSubscribed: userData.user.isSubscribed,
                        token: data.token
                    };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/signin'
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.token = user.token;
                token.isSubscribed = user.isSubscribed;
            }
            if (trigger === "update" && session) {
                token.name = session.name ?? token.name;
                token.role = session.role ?? token.role;
                token.isSubscribed = session.isSubscribed ?? token.isSubscribed;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.isSubscribed = token.isSubscribed;
                session.user.token = token.token;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET
});