const express = require("express");
require("dotenv").config();
const api = require("./config/prisma")


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
        const userExist = await api.user.findU({
            where : {
                email ,
            }
        })
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