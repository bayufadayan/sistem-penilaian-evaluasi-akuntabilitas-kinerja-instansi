/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

type Role = "ADMIN" | "USER";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("User not found");

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) throw new Error("Invalid credentials");

        const rememberMe = credentials.rememberMe === "true";

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          rememberMe,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      user?: any;
    }) {
      console.log("JWT Callback - Token before:", token);
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.rememberMe = user.rememberMe;
        token.accessToken = user.accessToken;
        console.log("JWT Callback - Token.rememberMe:", token.rememberMe);
      }

      token.exp = token.rememberMe
        ? Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60 // 90 hari
        : Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60; // 1 hari

      console.log("JWT Callback - Token after:", token);
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.role = token.role as Role;
        session.user.id = token.id as string;
        if (typeof token.accessToken === "string") {
          session.user.accessToken = token.accessToken;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
