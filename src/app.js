const express=require("express");
const {connectDB}=require("./config/databse");
const {User}=require("./models/user")
const app=express();

app.use(express.json());
app.post("/signup",async (req,res)=>{
    
   
    const user=new User(req.body);
    try{
        await user.save();
    res.send("user added successfully");
    }catch(err){
        res.status(404).send("Error in Saving User"+err.message);
    }
    
})






connectDB().then(()=>{
    console.log("db connected successfull");
    app.listen(3000,()=>{
    console.log("listening on port 3000")
});
 }).catch(err=>{
    console.error("error")
 })







