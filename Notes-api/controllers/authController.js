import users from "../models/userModel.js";
import { comparePassword } from "../utilities/helpers.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const loginController=async (req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password) return res.status(400).json({"msg":"missing email or password"})
        const foundUser = await users.findOne({email});
        if(!foundUser) return res.status(404).json({"msg":"User not found"})
        
        const isMatch = await comparePassword(password, foundUser.password);
        if(!isMatch) return res.status(401).json({ msg: "Wrong password" });
        const accessToken = jwt.sign(
            {id:foundUser._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"1d"}
        )
        // const refreshToken = jwt.sign(
        //     {id: foundUser._id},
        //     process.env.REFRESH_TOKEN_SECRET,
        //     {expiresIn:"7d"}
        // )
        // res.cookie("jwt",refreshToken,{httpOnly:true,maxAge:7*24*60*60*1000})//remove secure
        res.status(200).json(accessToken);
        

        
    }
    catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export default loginController;