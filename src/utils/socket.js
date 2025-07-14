const socket=require("socket.io");
const Chat = require("../models/chat");

const intializeSocket=(server)=>{
    // here the server is the http server we created in app.js
    const io=socket(server,{
        cors:{
            origin:"http://localhost:5173"
        }
        // this is used to connect with frontend
    });
    

// The below io.connection is triggered whenever a client connects to the socket server.
// The socket object represents that specific client's connection.
    io.on("connection",(socket)=>{
        // Handle events
        // the below are the event handlers==> joinChat, sendMessages, disconnect

        socket.on ("joinChat",({firstName,userId,targetUserId})=>{
            const roomId=[userId,targetUserId].sort().join("_");
            console.log(firstName +" joined Room "+ roomId)
            socket.join(roomId)
        })
        // in above code joinChat event we are receiving the details of other person who wnats to join the chat (from fronend) and creating a room soo that two mmebers can chat with ecah other and taht is accesible by only by both of them only.

        // this is used to receive the sent messages from client (from frontend)(socket.on())
        socket.on ("sendMessage",async ({firstName,userId,targetUserId,newMessage})=>{
            try{
            const roomId=[userId,targetUserId].sort().join("_");
            // we are creting an roomId using userId and TargetId by sorting them in ascending order and joiningthem using _

            // saving messages in the chat Database
            let chat=await Chat.findOne({
                participants:{$all:[userId, targetUserId]}
            })

            if(!chat){
                chat=new Chat({
                    participants:[userId,targetUserId],
                    messages:[],
                });
            }

            chat.messages.push({
                senderId:userId,
                text:newMessage
            })
            
            await chat.save();

            io.to(roomId).emit("messageReceived",{firstName,newMessage,userId,targetUserId})
            // io.to(roomId) here we are sending the message receved to that roomId
            // .emit("",{}) by using this we are sending message sto frontend so that we acn show them in ui which are received from other user

            }
            catch(err){
                console.log(err)
            }
        })

        socket.on ("disconnect",()=>{})
        
    })
}

module.exports=intializeSocket