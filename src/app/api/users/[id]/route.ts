import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { z } from "zod";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      products: {
        select: {
          id: true,
          title: true,
          image: true,
          price: true
        }
      }
    }
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}



const updateSchema = z.object({
  name: z.string().min(2).optional(),
  image: z.string().url().optional(),
  password: z.string().min(6).optional()
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(options);
  if (!session || session.user.id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const result = updateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid input", issues: result.error.format() }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: params.id },
    data: result.data
  });

  return NextResponse.json(updatedUser);
}