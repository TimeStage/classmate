import NextAuth, {  NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";


const options : NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET_ID!,
      
    }),
  ],
  callbacks: {
    async signIn({account,user,profile}) {
      if (account?.provider === "google") {
        return true
      }
      return false // Do different verification for other providers that don't have `email_verified`
    },
    session({session,user}){
      return {
        ...session,
        user
      }
    }
    
  },
  
};



export default NextAuth(options);
