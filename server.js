require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express()

app.use(express.json())
app.use('/api',require('./routes/authRouter.js'))

app.use(cors())
app.use(cookieParser())



const URI = process.env.MONGODB_URL;

mongoose.connect(URI, {

useNewUrlParser: true, 

useUnifiedTopology: true 

}, err => {
if(err) throw err;
console.log('Connected to MongoDB!!!')
});


const port =  process.env.PORT || 4000
app.listen(port, ()=>{
    console.log("server is runnnig on port",port);
})