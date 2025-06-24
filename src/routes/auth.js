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
        const saveduser=await user.save();
         
            //create a JWT token
            const token=await saveduser.getJWT();
            
            //add the token to the cookie and send baak to user
            res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
        
    res.send(user);
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
            throw new Error("Invalid Credentials")
            // return res.json({message:"Invalid Credentials"});
        }
        else{
            //create a JWT token
            const token=await user.getJWT();
            
            //add the token to the cookie and send baak to user
            res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
        }
       res.send(user)
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