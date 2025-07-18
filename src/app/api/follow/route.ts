import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { z } from "zod";

const followSchema = z.object({
  farmerId: z.string()
});

export async function POST(req: Request) {
  const session = await getServerSession(options);
  if (!session || session.user.role !== "BUYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = followSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid input", issues: result.error.format() }, { status: 400 });
  }

  // Prevent duplicate follows
  const exists = await prisma.follow.findFirst({
    where: {
      buyerId: session.user.id,
      farmerId: result.data.farmerId
    }
  });

  if (exists) {
    return NextResponse.json({ error: "Already following" }, { status: 409 });
  }

  const follow = await prisma.follow.create({
    data: {
      buyerId: session.user.id,
      farmerId: result.data.farmerId
    }
  });

  return NextResponse.json(follow, { status: 201 });
}