"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Movie = {
  id: string;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  poster: string;
  rating: number | null;
};

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const { data } = await api.get<Movie[]>("/movies");
        setMovies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };
    getMovie();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <header className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-widest text-accent-dim uppercase mb-1">
            Now Showing
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Movie Collection
          </h1>
        </div>
        {!authLoading &&
          (user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-gray-400">
                Hi, {user.name}
              </span>
              <Link
                href="/dashboard"
                className="border border-border-app text-black dark:text-white font-semibold px-4 py-2 rounded-md hover:bg-surface-2 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="bg-accent text-[#0F1220] dark:text-white font-semibold px-4 py-2 rounded-md hover:brightness-110 transition"
              >
                + Add Movie
              </Link>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/login"
                className="border border-border-app dark:text-white text-[#0F1220] font-semibold px-4 py-2 rounded-md hover:bg-surface-2 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-accent text-[#0F1220] dark:text-white font-semibold px-4 py-2 rounded-md hover:brightness-110 transition"
              >
                Register
              </Link>
            </div>
          ))}
      </header>

      {loading && <p className="text-center text-gray-400 py-16">Loading...</p>}
      {error && <p className="text-center text-red-400 py-16">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((m) => (
          <article
            key={m.id}
            className="bg-surface border border-border-app rounded-xl overflow-hidden hover:border-accent transition"
          >
            <div className="aspect-2/3 bg-surface-2 overflow-hidden">
              <img
                src={m.poster}
                alt={m.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold text-foreground truncate">
                {m.title}
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                <span>{m.releaseYear}</span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span>{m.genre}</span>
              </div>
              {m.rating != null && (
                <p className="mt-2 text-sm text-accent font-semibold">
                  ★ {m.rating}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
