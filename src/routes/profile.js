const express=require("express");
const {userAuth}=require("../middlewares/auth")
const profileRouter=express.Router();
const bcrypt=require("bcrypt");
const {User}=require("../models/user")
const validator=require("validator")
const validateProfileEdit=require("../utils/validateProfileEdit")
profileRouter.get("/profile/view",userAuth,async (req,res)=>{

    try{
        
       
       const user=req.user;
       
        res.send(user);
    }catch(err){
            res.status(404).send("ERROR : Please Login Again")
    }
});
profileRouter.post("/profile/edit",userAuth,async (req,res)=>{

   try{
      if(!validateProfileEdit(req)){
        throw new Error("Cannot Update the profile")
      }
      const loggedInUser=req.user;
      Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
      await loggedInUser.save();
      res.json({
        data:loggedInUser
      });

   }
   catch(err)
   { 
    res.status(400).send("ERROR : "+err.message)
   }

})
profileRouter.patch("/profile/password",userAuth,async (req,res)=>{

  try{
              const {password,newPassword}=req.body;
              const user=req.user;
              const {_id}=user;
              const isUpdateAllowed=await user.passwordCheck(password);
              if(!isUpdateAllowed){
                throw new Error("Please Enter the correct password");
              }
              const isNewPasswordStrong=validator.isStrongPassword(newPassword);
                         if(!isNewPasswordStrong)
                         {
                          throw new Error("Please Enter the Strong Password");
                         }
           const newpasswordHash=await bcrypt.hash(newPassword,10);
            user.password=newpasswordHash;
            user.save();

              res.send("PassWord Updated Successfully");



  }catch(err)
  {
    res.status(404).send("ERROR : "+err.message)
  }


})
module.exports=profileRouter;