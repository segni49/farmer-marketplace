import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3)
});

export async function POST(req: Request) {
  const session = await getServerSession(options);
  if (!session || session.user.role !== "BUYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = reviewSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid input", issues: result.error.format() }, { status: 400 });
  }

  // Optional: restrict to one review per product
  const existing = await prisma.review.findFirst({
    where: {
      buyerId: session.user.id,
      productId: result.data.productId
    }
  });

  if (existing) {
    return NextResponse.json({ error: "You've already reviewed this product" }, { status: 409 });
  }

  const review = await prisma.review.create({
    data: {
      ...result.data,
      buyerId: session.user.id
    }
  });

  return NextResponse.json(review, { status: 201 });
}

