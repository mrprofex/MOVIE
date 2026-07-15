"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

type User = { id: string; name: string; email: string };

function Page() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post<{
        token: string;
        message: string;
        user: User;
      }>("/signin", { email, password });
      console.log(data);
      if (!data?.token || !data?.user)
        throw new Error(data?.message || "Login failed");
      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : "Login failed";
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
          <p className="text-xs tracking-widest text-accent-dim uppercase mb-1  dark:text-white">
            Admit One
          </p>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mt-2">
            WELCOME BACK
          </h1>
          <p className="text-sm text-black dark:text-white mt-2">
            Sign in to pick up where you left off.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-400">Email</span>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className={inputClass}
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-11 bg-accent dark:text-white text-[#0F1220] font-semibold rounded-md hover:brightness-110 disabled:opacity-60 transition"
          >
            {loading ? "Signing in..." : "Enter the Theatre"}
          </button>
        </form>

        <p className="text-sm text-orange-400 mt-6 text-center">
          No account yet?{" "}
          <Link
            href="/register"
            className="text-accent hover:underline font-semibold"
          >
            Get a ticket
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Page;
