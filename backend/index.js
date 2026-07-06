const express = require("express");
require("dotenv").config();
const api = require("./config/prisma")
const bcrypt = require("bcrypt")
const PORT = process.env.PORT || 4000 
const app = express();
//mid
app.use(express.json())
app.use(express.urlencoded({extended : false }))

// sign up  route
app.post("/signup", async()=>{
    try {
        const {name , email , password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message : "Please provide all the details Name , email , Password"
            })
        }
        const userExist = await api.user.findUnique({
            where : {
                email ,
            }
        })
        if(userExist){
            return res.status(400).json({
                message : "Email is allready exist please add another email"
            })
        }
        const haspass = await bcrypt.hash(password , 10)
        const newuser = await api.user.create({
            data : {
                name , 
                email, 
                password : haspass
            }
        })
        return res.status(201).json({
            message : "User created successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message : "Server Error"
        })
    }
})

// sign in route 

// Unauthenticated Movie Route
app.get("/movies", async (req, res) => {
  try {
    const movies = await api.movie.findMany();

    return res.status(200).json({
      success: true,
      message: "Movie List",
      data: movies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// POST Movie API (Unauthenticated)
app.post("/movies", async (req, res) => {
  try {
    const { title, description, genre, releaseYear, poster, rating, userId } = req.body;

    const movie = await prisma.movie.create({
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

    res.status(201).json({
      success: true,
      message: "Movie added successfully",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(PORT , ()=>{
    console.log("Your server is running on:http://localhost:${PORT}")
})