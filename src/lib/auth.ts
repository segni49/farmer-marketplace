// src/auth.ts (recommended)
import NextAuth from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export const auth = NextAuth(options);