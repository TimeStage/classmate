import NextAuth, { Account, Profile } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import { getUserByAccount } from "./user-utils";

const prisma = new PrismaClient();

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET_ID!,
    }),
  ],
  adapter: PrismaAdapter(prisma, {
    getUserByAccount,
  }),
  callbacks: {
    async signIn({ account, profile }: { account: Account; profile: Profile }) {
      if (account.provider === "google") {
        return profile.email && profile.email.endsWith("@example.com");
      }
      return false; 
    },
  },
};

export default NextAuth(options);
