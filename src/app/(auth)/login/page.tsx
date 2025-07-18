"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (res?.error) {
      setError("Invalid credentials. Try again.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F4ED] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-3xl font-bold text-[#3C2F1D] text-center">Welcome Back</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B6C85B]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-[#DAD7C9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B6C85B]"
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#6E8B3D] text-white rounded-md hover:bg-[#597031] transition"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <p className="text-center text-[#3C2F1D] text-sm">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-[#A47E3C] underline">
            Register here
          </a>
        </p>
      </div>
    </main>
  );
}