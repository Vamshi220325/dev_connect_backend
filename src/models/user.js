
const validator=require("validator");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const UserSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        index:true,
        lowercase:true,
        trim:true,
        validate(value){
            const isEmailValid=validator.isEmail(value);
            if(!isEmailValid)
            {
                throw new Error("Email is not Valid")
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
           const isPasswordStrong=validator.isStrongPassword(value);
           if(!isPasswordStrong)
           {
            throw new Error("Please Enter the Strong Password");
           }
        }
    },
    age:{
        type:Number
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","others"],
            message:"{VALUE} is not allowed as gender"
        }
        // validate(value){
        //     if(!["male","female","others"].includes(value))
        //         throw new Error("Gender is not Valid")
        // }
    },
    photoURL:{
        type:String,
        validate(value){
            const isValidURL=validator.isURL(value);
            if(!isValidURL)
            {throw new Error("Photo URL is not Valid")}
        }
    },
    About:{
        type:String,
        default:"Default value"
    },
    Skills:{
        type:[String],
        
    }

},{timestamps:true});

UserSchema.methods.getJWT=async function(){
    const user=this;
   const token=await  jwt.sign({_id:user._id},"DEV_APPLICATION@777",{expiresIn:"1d"});
   return token;
}
UserSchema.methods.passwordCheck=async function(password){
    const user=this;
    const isPassWordValid=await bcrypt.compare(password,user.password);
    return isPassWordValid;
}
const User=mongoose.model("User",UserSchema);
module.exports={User};