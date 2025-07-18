import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

export default async function FarmersPage() {
  const farmers = await prisma.user.findMany({
    where: { role: "FARMER" },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      products: {
        select: { id: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return (
    <main className="min-h-screen bg-[#F7F4ED] px-6 py-10 space-y-8">
      <h2 className="text-3xl font-bold text-[#3C2F1D] text-center">Meet Our Farmers</h2>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {farmers.map((farmer) => (
          <Link
            key={farmer.id}
            href={`/farmers/${farmer.id}`}
            className="bg-white border rounded-md p-4 shadow-sm hover:shadow-md transition text-center"
          >
            {farmer.image && (
              <Image
                src={farmer.image}
                alt={farmer.name}
                className="h-20 w-20 object-cover rounded-full mx-auto mb-3"
              />
            )}
            <h3 className="text-[#3C2F1D] font-semibold text-lg">{farmer.name}</h3>
            <p className="text-sm text-[#A47E3C] mb-1">{farmer.products.length} products</p>
            {farmer.bio && (
              <p className="text-sm text-[#3C2F1D] line-clamp-2">{farmer.bio}</p>
            )}
          </Link>
        ))}
      </section>
    </main>
  );
}