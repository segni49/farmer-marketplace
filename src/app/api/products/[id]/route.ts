import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { z } from "zod";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      farmer: {
        select: { name: true, image: true }
      },
      reviews: {
        select: {
          rating: true,
          comment: true,
          buyer: { select: { name: true } }
        }
      }
    }
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}


const updateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  image: z.string().url().optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().nonnegative().optional(),
  category: z.string().min(2).optional()
});

export async function PUT(req: Request, { params }: { params: {id: string}}) {
    const session = await getServerSession(options);
    if (!session || session.user.role !== "FARMER") {
        return NextResponse.json({error: "unauthorized"}, {status: 401});
    }

    const existing = await prisma.product.findUnique({
        where: {id: params.id}
    });

    if (!existing || existing.farmerId !== session.user.id) {
          return NextResponse.json({errors: "forbidden or not found"}, {status: 403});
    }

    const body = await req.json();
    const result = updateSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json( {error: "invalid input", issues: result.error.format() }, { status: 400 });
    }

    const updated = await prisma.product.update({
        where: {id: params.id},
        data: result.data,

    });

    return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(options);
  if (!session || session.user.role !== "FARMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product || product.farmerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
  }

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}