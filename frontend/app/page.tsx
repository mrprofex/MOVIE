import movie from "./data/movie";

export default function Home() {
  return (
    <main className="min-h-screen bg-blue-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        🎬 Movie Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movie.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={m.poster}
              alt={m.title}
              className="w-full h-72 object-cover"
            />

            <div className="p-4">
              <h2 className="text-xl font-bold">{m.title}</h2>

              <p className="text-gray-600">Year: {m.year}</p>

              <p className="text-gray-600">🎭 Genre: {m.genre}</p>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
