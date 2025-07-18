import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options"; 
import { z } from "zod";

const schema = z.object({
  productId: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE", "HIDDEN"])
});

export async function PUT(req: Request) {
  const session = await getServerSession(options);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid input", issues: result.error.format() }, { status: 400 });
  }

  const updated = await prisma.product.update({
    where: { id: result.data.productId },
    data: { status: result.data.status }
  });

  return NextResponse.json(updated);
}