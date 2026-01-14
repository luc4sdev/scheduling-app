import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { parse } from "cookie";
import { cookies } from "next/headers";

class RateLimitError extends CredentialsSignin {
  code = "rate_limit";
}
class UserInactiveError extends CredentialsSignin {
  code = "inactive";
}
class InvalidLoginError extends CredentialsSignin {
  code = "invalid_credentials";
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

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/password`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" }
          });

          if (res.status === 429) throw new RateLimitError();
          if (!res.ok) throw new InvalidLoginError();

          let token: string | undefined;

          const setCookieHeader = res.headers.get("set-cookie");

          if (setCookieHeader) {
            const cookies = parse(setCookieHeader);
            token = cookies.token;
          }

          if (!token) {
             console.error("Token não encontrado nem nos cookies");
             return null;
          }

          const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`, {
            headers: { 
                Authorization: `Bearer ${token}` 
            }
          });
          
          if (!profileRes.ok) throw new InvalidLoginError();

          const userData = await profileRes.json();

          if (userData.isActive === false) {
            throw new UserInactiveError();
          }
          
          
          const cookieStore = await cookies()
          cookieStore.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60
          });
          
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            permissions: userData.permissions,
            isActive: userData.isActive,
          };

        } catch (error) {
          if (error instanceof CredentialsSignin) throw error;
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
            }
            return session;
        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET
});