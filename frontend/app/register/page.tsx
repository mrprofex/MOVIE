"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import api from "@/lib/api";

function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/signup", { name, email, password });
      router.push("/login");
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full h-11 bg-surface-2 border border-border-app rounded-md px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-surface border border-border-strong rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest text-accent-dim uppercase">
            New Member
          </p>
          <h1 className="text-3xl font-extrabold text-white mt-2">
            GET YOUR TICKET
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Create an account to start your own list.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-400">Name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-black dark:text-white">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-black dark:text-white">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={inputClass}
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-11 bg-accent text-[#0F1220] font-semibold rounded-md hover:brightness-110 disabled:opacity-60 transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already a member?{" "}
          <Link
            href="/login"
            className="text-accent hover:underline font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Page;
