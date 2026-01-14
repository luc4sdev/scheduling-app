import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

class RateLimitError extends CredentialsSignin {
  code = "rate_limit";
}
class UserInactiveError extends CredentialsSignin {
  code = "inactive";
}

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                const parsedCredentials = signInSchema.safeParse(credentials);

                if (!parsedCredentials.success) {
                    return null;
                }

                const { email, password } = parsedCredentials.data;

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/password`, {
                        method: "POST",
                        body: JSON.stringify({ email, password }),
                        headers: { "Content-Type": "application/json" }
                    });
                    if (res.status === 429) {
                    throw new RateLimitError();
                }
                    if (!res.ok) return null;

                    const data = await res.json();

                    if (data.token) {
                        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`, {
                            headers: { Authorization: `Bearer ${data.token}` }
                        });
                        if (!profileRes.ok) return null;

                        const userData = await profileRes.json();

                        if (userData.isActive === false) {
                            throw new UserInactiveError();
                        }
                        
                        return {
                            id: userData.id,
                            name: userData.name,
                            email: userData.email,
                            role: userData.role,
                            permissions: userData.permissions,
                            isActive: userData.isActive,
                            token: data.token,
                        };
                    }

                    return null;
                } catch (error) {
                    if (error instanceof CredentialsSignin) {
                        throw error;
                    }
                    console.error("Erro no authorize:", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/signin'
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.permissions = user.permissions;
                token.isActive = user.isActive;
                token.token = user.token;
            }

            if (trigger === "update" && session) {
                token.name = session.name ?? token.name;
                token.role = session.role ?? token.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.permissions = token.permissions;
                session.user.isActive = token.isActive;
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