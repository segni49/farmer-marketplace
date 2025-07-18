"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "BUYER"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
          if (err instanceof Error) {
             setError(err.message);
          }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F4ED] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-[#3C2F1D] text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
            required
          />
          <label className="block text-sm text-[#3C2F1D] mb-1" htmlFor="role">
                  Role  
          </label>

          <select
            id = "role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:ring-2 focus:ring-[#B6C85B]"
          >
            <option value="BUYER">Buyer</option>
            <option value="FARMER">Farmer</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#6E8B3D] hover:bg-[#597031]"
            }`}
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <p className="text-center text-sm text-[#3C2F1D]">
          Already registered?{" "}
          <a href="/login" className="text-[#A47E3C] underline">
            Login here
          </a>
        </p>
      </div>
    </main>
  );
}