const express=require("express");
const userRouter=express.Router();
const { userAuthForToken } = require("../middlewares/anthFortokens");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");


// here we are getting all th data of received request(which are still pending)
userRouter.get("/user/request/received",userAuthForToken,async(req,res)=>{
  try{
    const logedInUser=req.user;
    
    const data=await ConnectionRequest.find({
        toUserId:logedInUser._id,
        status:"interested"
    // }).populate("fromUserId");// ===> it will fetch all the fields of this fromUserId (means the firstname,lastname role,skills age,emialand all the details of this fromUserId by getting this all the details from user collection)
    // }).populate("fromUserId",["firstName","lastName"]);
     }).populate("fromUserId","firstName lastName age gender skills about photoUrl role isPremium");
    //  you can use any one in above three 
    // populate() is used to get all the data from that (ref="User")refering collection
    // if we dont use populate then we will only get the fromUserId and toUserIds if we use populate we can get the data related
// from which user weare getting the requset which is store din /user collection withthw help of ref="User" in ConnetcionRequestSchema
    res.send(data)
  }
  catch(err){
    res.status(400).send("Error "+ err.message)
  }
})


// this is an api to find requests send by logined user
userRouter.get("/user/Connection-requests/send",userAuthForToken,async(req,res)=>{
    try{
        let logedInUser=req.user;

        const data=await ConnectionRequest.find({
            fromUserId:logedInUser._id,
            status:"interested"
        }).populate("toUserId","firstName lastName age gender role skills createdAt updatedAt about email photoUrl isPremium");

        res.send(data);
    }
    catch(err){
    res.status(400).send("Error "+ err.message)
  }
})

// in this we are fetching all the data of accepted requests(all the friends data) 
userRouter.get("/user/your-connections/accepted",userAuthForToken,async(req,res)=>{
    try{
    const logedInUser=req.user;

// const users = await User.find({}, '_id');
// const validUserIds = users.map(u => u._id.toString());

// await ConnectionRequest.deleteMany({
//   $or: [
//     { from: { $nin: validUserIds } },
//     { to: { $nin: validUserIds } }
//   ]
// });
// this code is yuse to empty entire code of ConnetcionRequestSchema


    const connectionRequest=await ConnectionRequest.find({
        $or:[
            {fromUserId:logedInUser._id,status:"accepted"},
            {toUserId:logedInUser._id,status:"accepted"}
        ]
    })
    .populate("fromUserId",["firstName","lastName","email","age","gender","about","skills","photoUrl","role","isPremium"]).populate("toUserId",["firstName","lastName","email","age","gender","about","skills","photoUrl","role","isPremium"])
    // here we have used $or:[] and two piopulates because of, if we send the request and they have acepted our requets or they send they have the request to us and we have accpeted the arequest in the case we become friends(just think....) 

    const data=connectionRequest.map(row=>{
        if(row.fromUserId._id.toString()===logedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId
    })
    // this lines of code is used to get the only the related data in output if we dont us ethis we will get both fromUSsrId relate ddat and toUserID related data 
    // we have to toString() while comparing objectIds of mongoose databse,In Mongoose, _id fields are typically of type ObjectId, which is not a string by default.

    // res.send(connectionRequest)
    res.send(data)
    }
    catch(err){
        res.send("Error "+err.message);
    }
})

// this api is used to get the details of user details based on the search 
userRouter.get("/users/search",userAuthForToken,async(req,res)=>{
    // for performing searching api you have to pass in this way in backend "/users/search" ,if tou pass "/users/search?q=" it will show error.In postman or in frontend you can pass as "/users/search?q={inputValue}"
    try{
        let logedInUser=req.user
        let {q}=req.query;
        // console.log(q);
        // if we pass anything by ?value="" in api call to get that value we req.query

        const data= await User.find({
            firstName: {$regex:q, $options:'i',$ne:logedInUser.firstName}
            // $regex is like includes() it will find all the firstName that includes our typed input value
            // 'i' = case-insensitive (options:"i" will neglect case(uppercase or lowercase))
        }).select("firstName lastName age about skills photoUrl gender role email isPremium")
        res.send(data)

    }
    catch(err){
        res.send("Error "+err.message);
    }
})

// this si an feed api that shows the profiles to connect
userRouter.get("/feed",userAuthForToken,async(req,res)=>{
    // in this profiles feed we have to show only the profiles which are not connected to the user 
    // we dont wnat to show his profile and the profiles which are already connected to the user
    // means if we sent a reequest to someone and someone has sent a request to us we dont want to show them in the feed
    // if we both are friends before then we dont want to show them in the feed
    try{
        const logedInUser=req.user;

        const page=parseInt(req.query.page) || 1; // if page is not provided in the query then we will take it as 1
        const limit=parseInt(req.query.limit);
        // here we are getting the page and limit from the link(feed?page=0&limit=10)
        const skip=(page-1)*limit;


        const connections=await ConnectionRequest.find({
            $or:[
                {fromUserId:logedInUser._id},
                {toUserId:logedInUser._id}
            ]
        })
        // this will give us all the connections of the user
        const hideConnections=new Set();
        connections.forEach(row=>{
            hideConnections.add(row.fromUserId.toString());
            hideConnections.add(row.toUserId.toString());
        })
        // we are using Set to store the connections because Set is a collection of unique values, so it will not allow duplicate values
        // and we are using toString() because _id is an ObjectId and we need to convert it to string to compare it with the _id of the user
        // from above four lines of code we will get the set of unique user ids which are connected to the logedInUser ,if we eleiminate thes connections then we will get the profiles which are not connected to the user and we can show them in the feed

        const profiles=await User.find({
            $and:[
                {_id:{$ne:logedInUser._id}},
                {_id:{$nin:Array.from(hideConnections)}}
            ]
        }).select("firstName lastName age about skills photoUrl gender role isPremium").skip(skip).limit(limit);
        // here we are using $ne(not equal to) to not show the logedInUser profile and $nin(not in this array values) to not show the profiles which are already connected to the user
        // MongoDB’s $nin operator expects an array, not a Set. so we have to convert the Set to an array using Array.from(hideConnections)
        // select() will only give us the fields we sepcified in it 
        // skip() will skip the number of documents specified in it and limit() will limit the number of documents returned by it

        res.send(profiles)
    }
    catch(err){
        res.status(400).send("Error "+err.message);
    }
})
  


module.exports={userRouter}


// /user/:userId==>to get the userId from url we willuse req.params.userId;
// .user?userId=1234==>to get the userId from query we will use req.query.userId