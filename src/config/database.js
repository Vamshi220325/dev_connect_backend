const { default: mongoose } = require("mongoose");

const connectDB=async ()=>{await mongoose.connect("mongodb+srv://Vamshi123:qxO0Bo3FkrwiaM3K@cluster0.qkwvz.mongodb.net/devConnect");}
module.exports={connectDB};
 