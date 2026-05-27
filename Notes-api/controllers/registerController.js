
import users from "../models/userModel.js";
import "dotenv/config";
import hashPassword from "../utilities/helpers.js";

const registerController = async (req,res)=>{
    try{
    const {username,password,email}=req.body;

    if(!username||!email||!password) return res.status(400).json({"msg":"missing username,email or password"});
    const foundUser = await users.findOne({username});
    if(foundUser) return res.json({"msg":"Username already taken"});
    const hashed = await hashPassword(password)
    const newUser= new users({username,email,password:hashed});
    
    const saveUser = await newUser.save();
    res.status(201).json({saveUser})
    

    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
    
}

export default registerController;