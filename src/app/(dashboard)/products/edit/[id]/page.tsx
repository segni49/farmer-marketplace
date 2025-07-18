"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
};

export default function EditProductPage() {
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
      else setProduct(data);
    };
    fetchProduct();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!product) return;
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          price: parseFloat(product.price.toString()),
          quantity: parseInt(product.quantity.toString())
        })
      });

      if (!res.ok) throw new Error("Update failed");
      router.push("/dashboard/products");
    } catch (err:  unknown) {
         if(err instanceof Error) {
             setError(err.message);
         }
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <main className="p-6 text-[#3C2F1D]">
        Loading product information...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F4ED] px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-lg space-y-6">
        <h2 className="text-2xl font-bold text-[#3C2F1D]">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm text-[#3C2F1D] mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              value={product.title}
              onChange={handleChange}
              placeholder="Enter product title"
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm text-[#3C2F1D] mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Brief description of the product"
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm text-[#3C2F1D] mb-1">
              Image URL
            </label>
            <input
              id="image"
              name="image"
              type="url"
              value={product.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm text-[#3C2F1D] mb-1">
              Price (ETB)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              placeholder="100"
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
              required
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm text-[#3C2F1D] mb-1">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={product.quantity}
              onChange={handleChange}
              placeholder="10"
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm text-[#3C2F1D] mb-1">
              Category
            </label>
            <input
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="e.g., Vegetables"
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#6E8B3D] hover:bg-[#597031]"
            }`}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </div>
    </main>
  );
}