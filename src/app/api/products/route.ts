import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { z } from "zod";

//validation schema using zod

const productSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  image: z.string().url(),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative(),
  category: z.string().min(2)
});

export async function POST(req: Request) {
    const session = await getServerSession(options);
    if(!session || session.user.role !== "FARMER") {
        return NextResponse.json({error:"unauthorized"}, {status: 401});
    }

    const body = await req.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
         return NextResponse.json ({ error: "Validation failed", issues: result.error.format() },
      { status: 400 })

      };
      
      const product = await prisma.product.create({
        data: {
            ...result.data,
            farmerId: session.user.id
        }
      });
      return NextResponse.json(product, {status: 201})
}

export async function GET() {
  const products = await prisma.product.findMany({
    where: {
      quantity: { gt: 0 }
    },
    include: {
      farmer: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(products);
}