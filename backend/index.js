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



app.listen(PORT , ()=>{
    console.log("Your server is running on:http://localhost:${PORT}")
})