import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const  noteSchema = new mongoose.Schema({
    user:{
        type:ObjectId,
        ref:"userDB",
        required:true
    },
    title : {
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})


const note =   mongoose.model("Note", noteSchema);
export default note;