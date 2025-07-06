const adminAuth=(req,res,next)=>{
    console.log("Middleare for admin authentication");
   const token="manoj";
   const isAuthorized=token==="manoj";
   if(!isAuthorized){
    res.status(401).send("Unauthorized request")
   }
   else{
    next();
   }
}

const userAuth=(req,res,next)=>{
    console.log("Middleare for user authentication");
   const token="manoj";
   const isAuthorized=token==="manoj";
   if(!isAuthorized){
    res.status(401).send("Unauthorized request")
   }
   else{
    next();
   }
}
module.exports={
    adminAuth,userAuth
}