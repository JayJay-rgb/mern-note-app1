import users from "../models/userModel.js";


const user =async (req,res)=>{
    try{
    const me = await users.findById(req.user).select("-password");
    res.status(200).json(me)
}catch(err) {
    console.log(err);
    res.sendStatus(500);
}
     

}

export default user;