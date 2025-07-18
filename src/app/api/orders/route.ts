import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { z } from "zod";

const orderSchema = z.object({
  products: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive()
    })
  ),
  deliveryType: z.enum(["pickup", "delivery"])
});

export async function POST(req: Request) {
    const session = await getServerSession(options);
    if(!session || session.user.role !== "BUYER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = orderSchema.safeParse(body);
    if(!result.success) {
        return NextResponse.json({ error: "Validation failed", issues: result.error.format() }, { status: 400 });
    }

    const productData = await Promise.all(
    result.data.products.map(async ({ productId, quantity }) => {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product || product.quantity < quantity) {
        throw new Error(`Product unavailable: ${product?.title || "unknown"}`);
      }
      return {
        productId,
        quantity,
        price: product.price
      };
    })
  );

  
  const totalAmount = productData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      buyerId: session.user.id,
      totalAmount,
      deliveryType: result.data.deliveryType,
      products: {
        create: productData.map(({ productId, quantity }) => ({
          productId,
          quantity
        }))
      }
    }
  });

  return NextResponse.json(order, { status: 201 });
   }


 export async function GET() {
  const session = await getServerSession(options);
  if (!session || session.user.role !== "BUYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: {
      products: {
        include: {
          product: {
            select: { title: true, image: true, price: true }
          }
        }
      }
    },
    orderBy: {
      orderDate: "desc"
    }
  });

  return NextResponse.json(orders);
}

