const bcrypt = require("bcrypt");
const api = require("../config/prisma");

const demoUser = {
  name: "Demo User",
  email: "demo@movie.dev",
  password: "demo1234",
};

const movies = [
  {
    title: "Inception",
    description:
      "A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genre: "Sci-Fi",
    releaseYear: 2010,
    poster:
      "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    rating: 8.8,
  },
  {
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc on Gotham City, Batman must accept one of the greatest tests of his ability to fight injustice.",
    genre: "Action",
    releaseYear: 2008,
    poster:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: 9.0,
  },
  {
    title: "Interstellar",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: "Sci-Fi",
    releaseYear: 2014,
    poster:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 8.6,
  },
  {
    title: "Parasite",
    description:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    genre: "Thriller",
    releaseYear: 2019,
    poster:
      "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    rating: 8.5,
  },
  {
    title: "The Grand Budapest Hotel",
    description:
      "A writer encounters the owner of an aging high-class hotel who tells him of his early years serving as a lobby boy in the hotel's glorious days.",
    genre: "Comedy",
    releaseYear: 2014,
    poster:
      "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    rating: 8.1,
  },
  {
    title: "Spirited Away",
    description:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
    genre: "Animation",
    releaseYear: 2001,
    poster:
      "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    rating: 8.6,
  },
  {
    title: "Whiplash",
    description:
      "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.",
    genre: "Drama",
    releaseYear: 2014,
    poster:
      "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    rating: 8.5,
  },
  {
    title: "Mad Max: Fury Road",
    description:
      "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the help of a group of female prisoners.",
    genre: "Action",
    releaseYear: 2015,
    poster:
      "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
    rating: 8.1,
  },
  {
    title: "La La Land",
    description:
      "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
    genre: "Romance",
    releaseYear: 2016,
    poster:
      "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    rating: 8.0,
  },
  {
    title: "Get Out",
    description:
      "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception eventually reaches a boiling point.",
    genre: "Horror",
    releaseYear: 2017,
    poster:
      "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
    rating: 7.7,
  },
];

async function main() {
  const hashed = await bcrypt.hash(demoUser.password, 10);

  const user = await api.user.upsert({
    where: { email: demoUser.email },
    update: {},
    create: {
      name: demoUser.name,
      email: demoUser.email,
      password: hashed,
    },
  });

  console.log(`Seed user: ${user.email} (${user.id})`);

  for (const movie of movies) {
    await api.movie.create({ data: { ...movie, userId: user.id } });
  }

  console.log(`Inserted ${movies.length} movies.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await api.$disconnect();
  });
