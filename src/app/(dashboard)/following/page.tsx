import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options"; 
import prisma from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export default async function FollowingPage() {
  const session = await getServerSession(options);

  const follows = await prisma.follow.findMany({
    where: { buyerId: session?.user.id },
    include: {
      farmer: {
        select: {
          id: true,
          name: true,
          image: true,
          products: {
            select: {
              id: true,
              title: true,
              image: true,
              price: true
            },
            take: 3,
            orderBy: { createdAt: "desc" }
          }
        }
      }
    }
  });

  return (
    <main className="min-h-screen bg-[#F7F4ED] px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#3C2F1D]">Farmers You Follow</h2>

      {follows.length === 0 && (
        <p className="text-sm text-[#3C2F1D]">You haven’t followed anyone yet. Browse farmers and tap “Follow” to stay updated.</p>
      )}

      <section className="space-y-6">
        {follows.map(({ farmer }) => (
          <div key={farmer.id} className="bg-white border rounded-md p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <Image
                src={farmer.image ?? "/image.png"}
                alt={farmer.name}
                className="h-16 w-16 object-cover rounded-full"
              />
              <div>
                <h3 className="text-[#3C2F1D] font-semibold text-lg">{farmer.name}</h3>
                <Link
                  href={`/farmers/${farmer.id}`}
                  className="text-[#A47E3C] underline text-sm"
                >
                  View Profile
                </Link>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {farmer.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="block border rounded p-2 hover:shadow"
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    className="h-24 w-full object-cover rounded mb-2"
                  />
                  <p className="text-sm text-[#3C2F1D] font-medium">{product.title}</p>
                  <p className="text-xs text-[#6E8B3D]">ETB {product.price}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}