const express=require("express");
const requestRouter=express.Router();
const {userAuthForToken}=require("../middlewares/anthFortokens");
const {User}=require("../models/user");
const {ConnectionRequest}=require("../models/connectionRequest")
const tempaltes=require("../utils/emailTemplates");
const { handleSendEmail } = require("../utils/sendingEmail");


// this api is for sending the connection request
requestRouter.post("/request/:status/:userId",userAuthForToken,async (req,res)=>{
   try{
       const fromUserId=req.user._id;
       const toUserId=req.params.userId;
       const status=req.params.status;

       const connectionRequest=new ConnectionRequest({
         fromUserId,
         toUserId,
         status
       })
    
      //  here we are allowing only these two status type because while sending request in general either we cann send the request(interested) or reject(rejected) the request in tinder stroring only 
       const allowed=["interested","ignored"];
       if(!allowed.includes(status)){
          throw new Error(" this status type is not allowed ");
       }

      //  you cannot send request to yourself
      //  if(fromUserId.toString()==toUserId){
      //   throw new Error("you cannot request to yourself")
      //  }
      // you can use this code or pre code in connectionRequest.js  

      // if we send request to some one whose data is not in the database this will throw an error 
      const toUser=await User.findById(toUserId)
      if(!toUser){
        throw new Error("User Id not found! ")
      }

      // if you try to send request to the same user id again or if the user for whom you send request is again trying to send the requset to yourself , then this will throw an error 
      const alreadyExisted=await ConnectionRequest.findOne({
        $or:[
          {fromUserId,toUserId},
          {fromUserId:toUserId,toUserId:fromUserId}
        ]
      })
      if(alreadyExisted){
        throw new Error("Connection request already exits")
      }
      // $or:[] is used for searching two conditions you have $and also in ths same way
      const data=(await connectionRequest.save());
      // console.log(data)

      res.send({message: req.user.firstName +" has "+ status + " in "+ toUser.firstName+" profile",
         data
      })

      // here we are sending emails fro Connection request  
      // we have code after sending the response because of, if we write this code before it is taking some time to get the response from backend because of sending the email before sending response to frontend to avoid this, after sending  the reposnse only we have wriiten code to sent the email
      if(status==="interested"){
        const toUserDetails=await User.findOne({
          _id:toUserId
        }).select("firstName lastName email")
        // console.log(toUserDetails)
        const {subject,html}=tempaltes.connectionRequestEmail(toUserDetails.firstName,req.user.firstName)
        handleSendEmail(toUserDetails.email,subject,html)
      }
   }
   catch(err){
    res.status(400).send("Error "+err.message);
   }
})

requestRouter.post("/request/review/:status/:requestId",userAuthForToken, async (req,res)=>{
try{
  const logedInUser=req.user;
  const {status,requestId}=req.params;
  const allowed=["accepted","rejected"];
  if(!allowed.includes(status)){
     return res.status(400).send("Status type is not allowed")
  }
  
  const connectionRequest=await ConnectionRequest.findOne({
    _id:requestId,
    toUserId:logedInUser._id,
    status:"interested"
  })
  if(!connectionRequest){
    // return res.status(400).send("Filed to process the request")
    throw new Error(" Falied")
  }
  // here we have kept status as interested because of if we sent an request  the status will be interested, if the person send the request only then only on we can accept or reject the request. 
  connectionRequest.status=status;
  // now we are changing the status to accpeted or rejected for interested request (send request).
  // remember paste the requestId  not the fromUserId
  const data=await connectionRequest.save();
  res.send({message:logedInUser.firstName+" have "+ status +" the request",data})
}
catch(err){
    res.status(400).send("Error"+err.message);
}
})

module.exports={requestRouter};
