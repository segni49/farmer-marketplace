import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  image?: string;
  price: number;
  category: string;
  farmer: { id: string; name: string; image?: string };
};

export default function ProductCard({ product }: { product: Product}) {

    
  return (
    <Link href={`/item-detail/${product.id}`} className="bg-white border border-[#DAD7C9] rounded-lg shadow hover:shadow-lg p-4 transition-all">
      {product.image && (
        <Image
          src={product.image}
          alt={product.title}
          className="h-32 w-full object-cover rounded mb-2"
        />
      )}
      <h3 className="text-[#2E2312] font-semibold text-lg">{product.title}</h3>
      <p className="text-[#76A85C] text-sm">ETB {product.price}</p>
      <p className="text-xs text-[#D7A541]">{product.category}</p>
      <p className="text-xs mt-1 text-[#2E2312]">Seller: {product.farmer.name}</p>
    </Link>
  );
}