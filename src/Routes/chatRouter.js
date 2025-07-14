const express=require("express");
const { userAuthForToken } = require("../middlewares/anthFortokens");
const Chat = require("../models/chat");
const chatRouter=express.Router();

chatRouter.get("/chat/:targetUserId",userAuthForToken,async (req,res)=>{
    try{
        const {targetUserId}=req.params;
        const userId=req.user._id;

        let chat=await Chat.findOne({
            participants:{$all:[userId,targetUserId]}
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName"
        })

        if(!chat){
            chat =new Chat({
                participants:[userId,targetUserId],
                messages:[]
            })
        }
        await chat.save();

        res.send(chat);

    }
    catch(err){
        res.status(400).send("Error"+err.message)
    }

})

module.exports=chatRouter;