const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT
const app = express();
//mid
app.use(express.json())
app.use(express.urlencoded({extended : false }))

// sign up  route
app.post("/signup", async()=>{
    try {
        const {} = req.body;
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message : "Server Error"
        })
    }
})

// sign in route 



app.listen(PORT , ()=>{
    console.log("Your server is running on:http://localhost:${PORT}")
})