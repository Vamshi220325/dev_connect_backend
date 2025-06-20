const mongoose=require("mongoose");
const connectionRequestSchema=new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"//ref to user collection
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        enum:{
            values:["ignored","accepted","interested","rejected"],
            message:"{VALUE} is not supported"
        },
        required:true
    }

    
},{timestamps:true});
connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
    {throw new Error("cannot send request to userSelf");}
    next();
})
connectionRequestSchema.index({fromUserId:1,toUserId:1});
const ConnectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports=ConnectionRequestModel;