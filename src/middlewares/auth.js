const jwt=require("jsonwebtoken");
const { User } = require("../models/user");
const userAuth=async (req,res,next)=>{
//job is to read the cookies and validate and find user is present in db or not;
  try{
    const {token}=req.cookies;
    if(!token){throw new Error("Token is not valid ")}
 const decodedObj=await jwt.verify(token,"DEV_APPLICATION@777");
 const {_id}=decodedObj;
  const user=await User.findById(_id);
  if(!user){throw new Error("User not found ")}
  req.user=user;
  next();
  }catch(err){
      res.status(400).send("ERROR : "+err.message);
  }
 


}
module.exports={userAuth};