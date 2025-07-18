import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_: Request, { params }: { params: { productId: string } }) {
  const reviews = await prisma.review.findMany({
    where: { productId: params.productId },
    include: {
      buyer: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(reviews);
}