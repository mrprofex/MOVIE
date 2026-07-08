const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const api = require("./config/prisma");
const bcrypt = require("bcrypt");
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Please login again!" });
  }
  try {
    const finalToken = authorization.split(" ")[1];
    const isVerifiedUser = jwt.verify(finalToken, process.env.JWT_SECRET);
    req.user = { email: isVerifiedUser.email, id: isVerifiedUser.id };
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Please re-login your session has been expired!",
    });
  }
}

// sign up  route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all the details Name , email , Password",
      });
    }
    const userExist = await api.user.findUnique({ where: { email } });
    if (userExist) {
      return res.status(400).json({
        message: "Email is allready exist please add another email",
      });
    }
    const haspass = await bcrypt.hash(password, 10);
    await api.user.create({
      data: { name, email, password: haspass },
    });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// sign in route
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await api.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "signed in successfully",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// current user — used by the frontend to hydrate auth state
app.get("/me", auth, async (req, res) => {
  try {
    const user = await api.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/movies", async (req, res) => {
  try {
    const movies = await api.movie.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// movies belonging to the signed-in user (dashboard)
app.get("/my-movies", auth, async (req, res) => {
  try {
    const movies = await api.movie.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST Movie (auth required)
app.post("/movies", auth, async (req, res) => {
  try {
    const { title, description, genre, releaseYear, poster, rating } = req.body;

    if (!title || !description || !genre || !releaseYear || !poster) {
      return res.status(400).json({
        message:
          "Please provide title, description, genre, releaseYear and poster",
      });
    }

    const movie = await api.movie.create({
      data: {
        title,
        description,
        genre,
        releaseYear: Number(releaseYear),
        poster,
        rating: rating != null && rating !== "" ? Number(rating) : null,
        userId: req.user.id,
      },
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Your server is running on: http://localhost:${PORT}`);
});
