import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json({ error: "Email already in use." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
        image: "", // optional default image
        bio: ""    // optional default bio if you added it to schema
      }
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
       if (error instanceof Error) {
          return NextResponse.json({ error: "Registration error." }, { status: 500 });
       }
  }
}