"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
    quantity: "",
    category: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");

      router.push("/dashboard/products");
    } catch (err: unknown) {
       if (err instanceof Error) {
        setError(err.message);
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F4ED] px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-lg space-y-6">
        <h2 className="text-2xl font-bold text-[#3C2F1D]">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            type="text"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md border-[#DAD7C9] focus:ring-2 focus:ring-[#B6C85B]"
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md border-[#DAD7C9] focus:ring-2 focus:ring-[#B6C85B]"
          />
          <input
            name="image"
            type="url"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md border-[#DAD7C9] focus:ring-2 focus:ring-[#B6C85B]"
          />
          <input
            name="price"
            type="number"
            placeholder="Price in ETB"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md border-[#DAD7C9] focus:ring-2 focus:ring-[#B6C85B]"
          />
          <input
            name="quantity"
            type="number"
            placeholder="Available Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md border-[#DAD7C9] focus:ring-2 focus:ring-[#B6C85B]"
          />
          <input
            name="category"
            type="text"
            placeholder="Category (e.g., Vegetables)"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md border-[#DAD7C9] focus:ring-2 focus:ring-[#B6C85B]"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#6E8B3D] hover:bg-[#597031]"
            }`}
          >
            {loading ? "Creating..." : "Add Product"}
          </button>
        </form>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </div>
    </main>
  );
}