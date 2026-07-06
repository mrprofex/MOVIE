const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT
const app = express();
app.listen(PORT , ()=>{
    console.log("Your server is running on:http://localhost:${PORT}")
})