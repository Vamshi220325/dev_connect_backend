const express=require("express");
const {User}=require("../models/user")

const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const userRouter=express.Router();
const USER_SAFE_DATA="firstName lastName About Skills photoURL age gender";
userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",USER_SAFE_DATA);
        res.json({
            message:"Data fetched Successfully",
            data:connectionRequests
        })



    }
    catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
   //get all the connnection requests for loggein user

});
userRouter.get("/user/connections",userAuth,async (req,res)=>{
  
    try{
        const loggedInUser=req.user;
        ///status should be accepted
        //loggedinuser should be touser or fromuser
        const connectionRequests=await ConnectionRequest.find({
        
            $or:[{fromUserId:loggedInUser._id,status:"accepted"},{toUserId:loggedInUser._id,status:"accepted"}]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        const data=connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            else
            return row.fromUserId;
        });
       
        res.json({
            
            data:data
        });
    }
    catch(err)
    {
        res.status(400).send("ERROR : "+err.message)
    }



})
userRouter.get("/user/feed",userAuth,async (req,res)=>{

   try{
    const page=parseInt(req.query.page)||1;
    let limit=parseInt(req.query.limit)||10;
    limit=limit>50?50:limit;
    const skip=(page-1)*limit;
   //finding the connection requests that i sent and received
   const loggedInUser=req.user;
   const connectionRequest=await ConnectionRequest.find(
    {$or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]}
   ).select("fromUserId toUserId");
   const hideUsersFromFeed=new Set();
   connectionRequest.forEach((req)=>{
    hideUsersFromFeed.add(req.fromUserId.toString());
    hideUsersFromFeed.add(req.toUserId.toString());
   });

  const users=await User.find({
    $and:[{
        _id:{$nin:Array.from(hideUsersFromFeed)}
    },{_id:{$ne:loggedInUser._id}}]
  }).select(USER_SAFE_DATA).skip(skip).limit(limit);
  
   res.send(users);


   }
   catch(err)
   {
    res.status(404).send("ERROR : "+err.message)
   }

})
module.exports=userRouter;