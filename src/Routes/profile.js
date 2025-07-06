const express=require("express");
const profileRouter=express.Router();

const {userAuthForToken}=require("../middlewares/anthFortokens");
const { validatingEditProfileData } = require("../utils/validation");
const { userRouter } = require("./userRouter");
const { ConnectionRequest } = require("../models/connectionRequest");


// for getting profile data
profileRouter.get("/profile/view",userAuthForToken,async (req,res)=>{
try{
    const logedInUser=req.user;
    res.send(logedInUser);
}
catch(err){
    res.status(400).send("Error "+err.message);
}
})

// api for updating the profile data
profileRouter.patch("/profile/edit",userAuthForToken ,async (req,res)=>{
try{
    const allowedEditFields=["firstName","lastName","age","skills","about","gender","photoUrl","role","gender"];
    // the above is the only allowedEditFields remaining are not allowed
    const isvalid=Object.keys(req.body).every((field)=>allowedEditFields.includes(field));
    // this will first get alll te keys of req.body(means which we enter to edit) and cheks every key we enter ed is present in allowedEditFields ar enot if one field is not present also itbwill retrun false if aonly all the keys are allowed filels to edit then it will return true
    if(!isvalid){
        throw new Error("Cannot update this field");
    }
    const logedInUser=req.user;
    if (!req.body.photoUrl || req.body.photoUrl.trim() === "") {
      if (req.body.gender === "male") {
        req.body.photoUrl =
          "https://media.istockphoto.com/id/1327592389/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=kl9_IgA2ixssEdoXGJW7vuBh6lzL_RvYWgWB20TdzCA=";
      } else if (req.body.gender === "female") {
        req.body.photoUrl =
          "https://media.istockphoto.com/id/1327592564/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-woman.jpg?s=612x612&w=0&k=20&c=kqhekIAYrzVkY2hR4GsrsvfLcB_3JnpemBDRYlelof8=";
      }
    }
    // in userAuthForToken we stored loginedIn use rdata in req.user soo we have used that data now and storing it int logedinuser here
    Object.keys(req.body).forEach((keys)=>logedInUser[keys]=req.body[keys]);
    // this is uesd to get all the keys of req.body and forEach() iterates over each value and updates the logedInUser keys values to req.body keys values(logedInUser[keys]=req.body[keys])  
    await logedInUser.save();
    // this si use dto save the changes in database
    // res.send(`${logedInUser.firstName+ " your data have sucessfully updated"}`)
    res.send({message:logedInUser.firstName+" "+logedInUser.lastName+" your data have sucessfully updated",
        data:logedInUser});
}
catch(err){
    res.status(400).send("Error "+err.message);
}
})

// this is used to display the relationship between loginUser and that particular profile you are viewing of a person sercahed in search bar in frontend 
userRouter.get("/connections/status/:targetId",userAuthForToken, async(req,res)=>{
  try{
    const logedInUser=req.user;
    const {targetId}=req.params;

    const data=await ConnectionRequest.findOne({
      $or:[
        {fromUserId:logedInUser._id,toUserId:targetId},
        {toUserId:logedInUser._id,fromUserId:targetId}
      ]
    })
    // res.send(data)

    if(!data) return res.send({status:"none"});

    if(data.status=="accepted"){
      return res.send({status:"friends"})
    }

    if(data.status==="interested"){
      if(data.fromUserId.toString()===logedInUser._id.toString()){
        return res.send({status:"sent"})
      }
      else{
        return res.send({status:"received"})
      }
    }
    
    if(data.status==="ignored"){
       return res.send({status:"ignored"})
    }
    res.json({ status: "none" });

  }
  catch(err){
    res.status(400).send("Error "+err.message);
}
})

module.exports={profileRouter};