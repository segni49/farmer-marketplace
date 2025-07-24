"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SectionTitle from "@/components/SectionTitle";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "BUYER",
    image: "",
    bio: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/login");
    } catch (err: unknown) {
       if(err instanceof Error) {
           setError(err.message);
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDF7F0] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-[#DAD7C9] p-6 rounded-md shadow-sm">
        <SectionTitle emoji="🧑‍🌾" text="Create Your Account" />

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="name" className="text-sm text-[#2E2312] block mb-1">Full Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#76A85C]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm text-[#2E2312] block mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#76A85C]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-[#2E2312] block mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#76A85C]"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="role" className="text-sm text-[#2E2312] block mb-1">User Type</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#76A85C]"
            >
              <option value="BUYER">Buyer</option>
              <option value="FARMER">Farmer</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className="text-sm text-[#2E2312] block mb-1">Profile Image URL (optional)</label>
            <input
              id="image"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#76A85C]"
            />
          </div>

          <div>
            <label htmlFor="bio" className="text-sm text-[#2E2312] block mb-1">Bio (optional)</label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about your farm or background..."
              className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#76A85C]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#76A85C] hover:bg-[#597031]"
            }`}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {error && <p className="text-sm text-center mt-4 text-red-600">{error}</p>}

        <p className="text-sm text-center text-[#2E2312] mt-6">
          Already registered?{" "}
          <Link href="/login" className="text-[#D7A541] underline font-medium">Log in</Link>
        </p>
      </div>
    </main>
  );
}