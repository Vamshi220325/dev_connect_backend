const express=require("express");
const authRouter=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {User}=require("../models/user");
const {validateSignUp}=require("../utils/validateSignUp");
const { userAuth } = require("../middlewares/auth");
authRouter.post("/signup",async (req,res)=>{
 try{
    
    validateSignUp(req);
    const {firstName,lastName,emailId,password}=req.body;
    const passwordHash=await bcrypt.hash(password,10);
    
        const user=new User({
            firstName,lastName,emailId,password:passwordHash
        });
        await user.save();
    res.send("user added successfully");
    }catch(err){
        res.status(404).send("ERROR : "+err.message);
    }
    
});
authRouter.post("/login",async (req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user){throw new Error("Invalid Credentials")}
        const isPasswordValid=await user.passwordCheck(password);
        if(!isPasswordValid){
            throw new Error("Invalid Credentials");
        }
        else{
            //create a JWT token
            const token=await user.getJWT();
            console.log(token);
            //add the token to the cookie and send baak to user
            res.cookie("token",token);
        }
       res.send("Login successfull")
    }catch(err){
        res.status(404).send("ERROR : "+err.message);
    }
})
authRouter.post("/logout",(req,res)=>{
    try{
          res.cookie("token",null,{expires:new Date(Date.now())});
          res.send("logout successfullly");
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})












module.exports=authRouter;