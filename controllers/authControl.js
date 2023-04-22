const Users = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const authControl={
    register : async(req,res) => {
        try {
            const {fname,uname,email,passwd} = req.body

            
            const user_name =await Users.findOne({uname})
            if(user_name)
             return res.status(400).json({msg:"Username already exixts"})

            const user_email =await Users.findOne({email})
            if(user_email) 
            return res.status(400).json({msg:"Email already exixts"})

            if(passwd.length < 8) 
            return  res.status(400).json({msg:"Password must be more than 8 chars"})

            const pHash = await bcrypt.hash(passwd,12)

            const newUser = new Users({
                fname,uname,email,passwd:pHash
            })
          

            const access_token = createAccessToken({id: newUser._id})
            const refresh_token = createRefreshToken({id: newUser._id})

           res.cookie('refreshtoken',refresh_token,{
            httpOnly:true,
            path:"/api/refresh_token",
            maxAge: 30*24*60*60*1000

           })

           await newUser.save()
           res.json({
            msg:"registered...",access_token,refresh_token,user:{
                ...newUser._doc,
                passwd:pHash
            }
           })

            res.json({msg:"registered Successfully...."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
            
        }
    },
    login:async(req,res) =>{
        try {
            const {email,passwd} = req.body
            const user = await Users.findOne({email})
            .populate("followers following","-passwd")

            if(!user) return res.status(400).json({msg:"invalid username or password"})

            const isMatch = await bcrypt.compare(passwd,user.passwd)
            if(!isMatch) return res.status(400).json({msg:"invalid username or password"})
          
            const access_token = createAccessToken({id: user._id})
            const refresh_token = createRefreshToken({id: user._id})

            res.cookie('refreshtoken',refresh_token,{
            httpOnly:true,
            path:"/api/refresh_token",
            maxAge: 30*24*60*60*1000

           })
           res.json({
            msg:"login Successful....",access_token,refresh_token,user:{
                ...user._doc,
                passwd:""
            }})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
            
        }
    },
    logout:async(req,res) =>{
        try {
            res.clearCookie("refreshtoken",{path:"/api/refresh_token"})
            return res.json({msg:"Logout successfull...."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
            
        }
    },
    generateAccessToken:async(req,res) =>{
        try {
            
            const rf_token = req.cookies.refreshtoken
            if(!rf_token)  return res.status(400).json({msg: "Login first..."})
            jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET , async(err,result)=>{
                if(err) return res.status(400).json({msg: "Login first..."}) 
            })

            console.log(result);
            const user = await Users.findById(result.id).select("-passwd")
            .populate("followers following","-passwd")
            //res.json({rf_token})
            if(!user) return res.status(400).json({msg: "Invalid Operation..."})
            const access_token = createAccessToken({id:result.id})
            res.json({
                access_token,user
            })

            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

 


}

const createAccessToken = (payload) =>{
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET ,{expiresIn:"1d"})
        
}
const createRefreshToken = (payload) =>{
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET ,{expiresIn:"30d"})

}
module.exports = authControl