const express = require("express");
require("dotenv").config();
const api = require("./config/prisma");
const bcrypt = require("bcrypt");
const PORT = process.env.PORT || 4000;
const app = express();
//mid
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//auth route

function auth(req, res, next) {
  console.log("hii this is auth ");
  const { authorization } = req.headers;
  if (!authorization) {
    return res.send("please login again! invalid password");
  }
  try {
    const finalToken = authorization.split(" ")[1];
    const isVerifiedUser = jwt.verify(finalToken, process.env.MYSECRET);
    console.log(isVerifiedUser);
    req.user = { email: isVerifiedUser.email, id: isVerifiedUser.id };
    next();
  } catch (err) {
    return res.send({
      message: "Please re-login your session has been expired!",
      err,
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
    const userExist = await api.user.findUnique({
      where: {
        email,
      },
    });
    if (userExist) {
      return res.status(400).json({
        message: "Email is allready exist please add another email",
      });
    }
    const haspass = await bcrypt.hash(password, 10);
    const newuser = await api.user.create({
      data: {
        name,
        email,
        password: haspass,
      },
    });
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// sign in route

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.json({
    message: "signed in successfully",
    token,
  });
});

app.get("/movies", async (req, res) => {
  try {
    const movies = await api.movie.findMany();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST Movie
app.post("/movies", async (req, res) => {
  try {
    const { title, description, genre, releaseYear, poster, rating, userId } =
      req.body;

    const movie = await api.movie.create({
      data: {
        title,
        description,
        genre,
        releaseYear,
        poster,
        rating,
        userId,
      },
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// hello every one 
app.listen(PORT, () => {
  console.log("Your server is running on:http://localhost:${PORT}");
});
