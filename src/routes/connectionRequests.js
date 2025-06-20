const express=require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");
requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
    try{
        const user=req.user;
    const fromUserId=user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;
    const allowedStatus=["interested","ignored"];
    if(!allowedStatus.includes(status)){
        throw new Error("Invalid Satus type");
    }
    
    const toUser=await User.findById(toUserId);
    if(!toUser){
       return res.json({
            message:"User not found"
        })
    }
    const existingConnectionRequest=await ConnectionRequest.findOne({
        $or:[{fromUserId:fromUserId,toUserId:toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}]
       
    });
    if(existingConnectionRequest)
    {
        throw new Error("Connection request already sent");
    }
    const connectionRequest=new ConnectionRequest({
        toUserId,
        fromUserId,
        status
    });


    const data=await connectionRequest.save();
   
    res.json(
        {
            message:user.firstName+" is "+status+" in "+toUser.firstName,
            data
        }
    )



    }catch(err){
         res.status(400).send("ERROR : Request not sent : "+err.message)
    }
})
requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{

   try{
    const loggedInUser=req.user;
    const status=req.params.status;
    const requestId=req.params.requestId;
    const allowedStatus=["accepted","rejected"];
    if(!allowedStatus.includes(status))
    {
        return res.json({
            message:"status is not valid"
        })
    }
    const connectionRequest=await ConnectionRequest.findOne({_id:requestId,
        toUserId:loggedInUser._id,
        status:"interested"
    });
    
    if(!connectionRequest)
        {
        return res.json({
            message:"No request found"
        })
    }
    connectionRequest.status=status;
    const data=await connectionRequest.save();
    res.json({
        message:"You "+status+" the request ",
        data,
    })
     //loggedinuser should be touserid
     //loggedin user status should be interested
     //request id should be in db


   }catch(err){
    res.status(400).send("ERROR : "+err.message)
   }




})
module.exports=requestRouter;