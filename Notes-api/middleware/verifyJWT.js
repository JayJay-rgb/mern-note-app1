import jwt  from "jsonwebtoken";
import "dotenv/config"

const verifyJWT = (req,res,next)=>{
    const authorizedHeader= req.headers.authorization||req.headers.Authorization;
    if(!authorizedHeader) return res.sendStatus(403);
    if(!authorizedHeader.startsWith("Bearer ")) return res.sendStatus(401);

    const token = authorizedHeader.split(" ")[1];
    if(!token) return res.sendStatus(401);

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded)=>{
            if(err) return res.sendStatus(401);
            req.user = decoded.id.toString();

            next();
        }   
    )
    
}

export default verifyJWT
