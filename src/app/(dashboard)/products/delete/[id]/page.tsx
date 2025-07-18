"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  image: string;
};

export default function DeleteProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to load product");
      else setProduct({ id: data.id, title: data.title, image: data.image });
    };
    fetchProduct();
  }, [params.id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${params.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/dashboard/products");
    }catch (err:  unknown) {
         if(err instanceof Error) {
             setError(err.message);
         }
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <main className="p-6 text-[#3C2F1D]">Loading product info...</main>;
  }

  return (
    <main className="min-h-screen bg-[#F7F4ED] px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6 text-center">
        <Image
          src={product.image}
          alt={product.title}
          className="h-40 w-full object-cover rounded-md"
        />
        <h2 className="text-xl font-bold text-[#3C2F1D]">
          Are you sure you want to delete <span className="text-[#A47E3C]">{product.title}</span>?
        </h2>
        <p className="text-sm text-[#3C2F1D]">This action cannot be undone.</p>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            onClick={() => router.push("/dashboard/products")}
            className="px-4 py-2 rounded-md border border-[#6E8B3D] text-[#6E8B3D] hover:bg-[#B6C85B]/20"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    </main>
  );
}