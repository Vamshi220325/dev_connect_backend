const express=require("express");
const {connectDB}=require("./config/database");
const app=express();
const cookieParser=require("cookie-parser");
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/connectionRequests");
const userRouter=require("./routes/user");
const cors=require("cors");

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
connectDB().then(()=>{
    console.log("db connected successfull");
    app.listen(3000,()=>{
    console.log("listening on port 3000")
});
 }).catch(err=>{
    console.error("error")
 })







