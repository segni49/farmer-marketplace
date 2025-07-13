// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import {  DefaultJWT } from "next-auth/jwt";
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // ✅ Add role here
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role?: string; // ✅ Add role to User type
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string; // ✅ Add role to JWT token
  }
}