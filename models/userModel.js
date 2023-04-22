const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true,
        maxlength:25
    },
    uname:{
        type:String,
        required:true,
        trim:true,
        maxlength:25,
        unique:true

    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true

    },
    passwd:{
        type:String,
        required:true,
        trim:true
       

    },
    avatar:{
        type:String,
        default:"https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png"

    },
    role:{
        type:String,
        default:'user'
    },
    mobile:{
        type:String,
        default:'user'
    },
    story:{
        type:String,
        default:"",
        maxlength:200, 
    },
    followers:[{type:mongoose.Types.ObjectId,ref:"user"}],
    following:[{type:mongoose.Types.ObjectId,ref:"user"}]

},{
    timestamps:true
})

module.exports = mongoose.model("user",userSchema)