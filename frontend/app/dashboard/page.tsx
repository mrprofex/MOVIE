"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [poster, setPoster] = useState("");
  const [rating, setRating] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  const loadMovies = () => {
    setListLoading(true);
    setListError(null);
    api
      .get<Movie[]>("/my-movies")
      .then(({ data }) => setMovies(data))
      .catch((err) => setListError(err?.message || "Failed to load movies"))
      .finally(() => setListLoading(false));
  };

  useEffect(() => {
    if (user) loadMovies();
  }, [user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await api.post("/movies", {
        title,
        description,
        genre,
        releaseYear: Number(releaseYear),
        poster,
        rating: rating ? Number(rating) : null,
      });
      setTitle("");
      setDescription("");
      setGenre("");
      setReleaseYear("");
      setPoster("");
      setRating("");
      loadMovies();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : "Failed to add movie";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-black dark:text-white">
        Loading...
      </div>
    );
  }

  const inputClass =
    "w-full bg-surface-2 border border-border-app rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent transition";

  return (
    <div className="min-h-screen bg-background-2 text-foreground p-8">
      <header className="mb-8">
        <p className="text-xs tracking-widest text-accent-dim uppercase mb-1">
          Backstage
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-950 dark:text-white">Dashboard</h1>
        <p className="text-black  dark:text-white mt-1">Welcome back, {user.name}.</p>
      </header>

      <section className="mb-10 rounded-xl border border-border-strong bg-surface p-6 max-w-3xl">
        <h2 className="text-lg font-bold mb-1">Add a movie</h2>
        <p className="text-sm text-black dark:text-white mb-5">
          Fill in the details to add a new title to the collection.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-green-400  dark:text-white">Title</span>
            <input
              className={inputClass}
              placeholder="e.g. Inception"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-green-400 dark:text-white">Description</span>
            <textarea
              className={`${inputClass} min-h-[96px]`}
              placeholder="What's it about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-green-400 dark:text-white">Genre</span>
              <input
                className={inputClass}
                placeholder="e.g. Sci-Fi"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-green-400 dark:text-white">Release year</span>
              <input
                className={inputClass}
                type="number"
                placeholder="2010"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-green-400 dark:text-white">Poster URL</span>
            <input
              className={inputClass}
              placeholder="https://..."
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-green-400 dark:text-white">Rating (optional)</span>
            <input
              className={inputClass}
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="0 - 10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </label>

          {formError && <p className="text-sm text-yellow-950 dark:text-white">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-accent text-[#411234] font-semibold py-2.5 rounded-md hover:brightness-110 disabled:opacity-60 transition dark:bg-black dark:text-white"
          >
            {submitting ? "Adding..." : "Add Movie"}
          </button>
        </form>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-bold">Your movies</h2>
          {movies.length > 0 && (
            <span className="text-sm text-pink-500">{movies.length} total</span>
          )}
        </div>

        {listLoading && <p className="text-blue-700 dark:text-white">Loading...</p>}
        {listError && <p className="text-nevy to-blue-500 dark:text-white">{listError}</p>}
        {!listLoading && !listError && movies.length === 0 && (
          <div className="rounded-xl border border-border-app bg-surface p-8 text-center text-orange-400 dark:text-white">
            You haven&apos;t added any movies yet.
          </div>
        )}

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
                <h3 className="text-lg font-bold text-foreground truncate">
                  {m.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                  <span>{m.releaseYear}</span>
                  <span className="w-1 h-1 rounded-full bg-blue-700" />
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
      </section>
    </div>
  );
}
