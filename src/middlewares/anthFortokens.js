const jwt=require("jsonwebtoken");
const {User}=require("../models/user")

const userAuthForToken= async(req,res,next)=>{
try{
    const {token}=req.cookies;
    if(!token){
        // throw new Error("Token not found !!!")
        return res.status(401).send("Token not found !!!");
    }

    const validateToken=await jwt.verify(token,process.env.JWT_TOKEN);
    const {_id}=validateToken;
    const logedInUserData=await User.findById(_id);
    if(!logedInUserData){
        throw new Error("User details not found")
    }
    req.user=logedInUserData
    next()
}
catch(err){
    res.status(400).send("Error "+err.message)
}
}

module.exports={
    userAuthForToken
}