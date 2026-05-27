import mongoose from "mongoose";

const userModel= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
});

const users= mongoose.model("userDB",userModel);

export default users;