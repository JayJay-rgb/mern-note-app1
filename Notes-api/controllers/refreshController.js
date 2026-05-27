import jwt from "jsonwebtoken";
import users from "../models/userModel.js";
import "dotenv/config";


const refreshController = (req,res)=>{
    if(!req.cookies?.jwt) return res.sendStatus(403);

    const refreshToken = req.cookies.jwt;
    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err,decoded)=>{
            if(err) return res.status(401).send("Something went wrong")
            const foundUser = await users.findById(decoded.id)
            if(!foundUser || foundUser._id !== decoded.id) return res.sendStatus(403);

            const accessToken= jwt.sign(
                {id: foundUser._id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:"1d"}
            )

            res.json({accessToken})

        }

    )
    
}

export default refreshController;