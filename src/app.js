const express=require("express");
const connectDb=require("./config/database")
require("dotenv").config();// this is used for hiding confidential data
const cookieParser = require("cookie-parser");
const app=express();
const {authRouter}=require("./Routes/authRouter");
const {profileRouter}=require("./Routes/profile");
const {requestRouter}=require("./Routes/request");
const {userRouter}=require("./Routes/userRouter");
const cors=require("cors");


app.use(cors({
    origin:"http://localhost:5173", // pass the frontend url here
    credentials:true
    // this is used to set the cookie in the browser, if we dont use this then cookie will not be set in the browser
}));
// this is used to avoid CORS errors, it is used to allow cross-origin requests(means making requests(api calls) from different domains(frontend to backend)) it is like a middleware
app.use(express.json());
app.use(cookieParser());


// these will run on every route handler
// instead of using app.get or app.post etc for route handlers, here we have used expres.Router() fro route handling to make app.js code clean  
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter);

// remember we can only one response to request, once the reponse have send then again response will not send without again getting the request from the user



connectDb().then(()=>{
    console.log("Database connection is established sucessfullly"); 
    app.listen(4000,()=>{
        console.log("Server is running on port 4000");
    })
    // now see we are getting coonection with dtabase first and then serevr is running on port 4000 to listen to requests.
})
.catch((err)=>{
    console.log(err+"Database cannot be connected")
})





// ❌ Without await → you get Promises instead of real data → leads to bugs or crashes

// ✅ With await → waits for the result → your code works correctly


















// const express=require("express");
// const connectDb=require("./config/database")
// const {User}=require("./models/user");
// const {validatingData}=require("./utils/validation");
// const validator=require("validator");
// const bcrypt=require("bcrypt");
// const cookieParser = require("cookie-parser");
// const jwt=require("jsonwebtoken");
// const app=express();
// const {userAuthForToken}=require("./middlewares/anthFortokens");


// app.use(express.json());
// // app.use("/",()=>{})===> this wotks only for that matching routes(if we passs route it will run for matchning routes for alal then type of methods)
// // app.use(()=>{})===> this runs on all the routes ( if we dont pass any path then this runs on all the kind of routes and all the types of routes )
// // express.json() is middleware 
// // is used to conevrt the json data into js object from the body of http requests.
// // if we dont use this then req.body will be undefined
// app.use(cookieParser());
// // it is used for reading the cookies and it is like a middleware as above expres.json()
// // if we dont use this and try to read the cookie then we will get output as undefined

// app.post("/signup",async (req,res)=>{
//     // creating a new Instance of the User modal
//     // creating a new instance is nothing but creating a new document
//     // const user=new User({
//     //     firstName:"Manoj",
//     //     lastName:"Madavarapu",
//     //     email:"manoj@gmail.com",
//     //     password:"Hii",
//     //     age:22,
//     // });
//     // instead of giving this data directly we can give data that we got from frontend
//     console.log(req.body);
//     // req.body will give you the data that you got from apis(means from frontend which is present in postman in body, raw and in json) 
//     // this will be undefined if you dont use express.json() middleware
//     try{
//     const {firstName,lastName,email,password}=req.body;
//     // validation of data
//     validatingData(req);
//     // above we are validatingData data by using validatingData function from utils/ validation.js 
    
//     // Encrypt the password
//     // encrypt is nothing but instaed of storing password direcltly in database it encrypts it into long string and stores it in database
//    const passwordHash=await bcrypt.hash(password,10);
//    console.log(passwordHash);
// //    bcrypt.hash(password,10)==>1st aparameter is password(plain text passowrd) and 2nd paramter is salt rounds
// // It tells bcrypt how many times to process the data. Higher numbers mean more secure ,but takes more time for hashing and validating also.10 is a commonly used salt rounds and it is balanced value.

//     // const user=new User(req.body);
//     // instead if giveing in this way thsi is the best way
//     const user=new User({
//         firstName,
//         lastName,
//         email,
//         password:passwordHash
//     })

//     await user.save();
//     // This will insert the user data into the users collection in MongoDB.
//     res.send("Data have been succefully added")
//     }
//     catch(err){
//         res.status(500).send("Error "+err.message)
//     }
// })

// // for login
// app.post("/login", async (req,res)=>{
// try{
//     const {email,password}=req.body;
//     if(!validator.isEmail(email)){
//         throw new Error("Enter correct email");
//     }
//     const user=await User.findOne({email:email});
//     // it will check for entered email is present in database or not,if present it will return entire user object(in user variabel now enrite user object dat awill be present)
//     if(!user){
//         throw new Error("Invalid credentials");
//     }
//     const passwordisValid=await bcrypt.compare(password,user.password);
//     // it will decrypt the password in database and check with entered passowrd and return true or false
//     if(passwordisValid){

//         // create an JWT token
//         // JWT stand sfor jsonweb token it consits of theree parts header payload and signature
//         const token=await jwt.sign({_id:user._id},"Manoj@123");
//         // console.log(token);
//         // jsonwebtoken is used fro crating and valiadting the tokens jwt.sign() is usd for creating the token first paarmeter {_id:user._id} is the hiding data and second paarmeter is like a password
//         // here we have created a token and store in in cookie and sending it along with response as shown below
//         // add cookie with token.
//         res.cookie("token",token);
//         res.send("Login successfull !");
//     }
//     else{
//         throw new Error("Invalid credentials password");
//     }
// }
// catch(err){
//     res.status(400).send("Error "+err.message);
// }
// })

// // get the user data from database
// app.get("/user",async (req,res)=>{
//     const emailId=req.body.email;
//     // in this we will store the email that we got from frontend
//     try{
//         const user=await User.findOne({email:emailId}) ;
//         // Modal.find() is used to get data from database Modal means modal name
//         // console.log(user)
//         if(!user){
//               // if we enter wrong emilid then this eexecutes
//             res.send("User not found");
//         }
//         else{
//             res.send(user);
//         }
//     }
//     catch(err){
//         res.status(400).send("Somethimg went wrong"+err);
//     }
// })

// // if you want to get all the data of users from database then do this
// app.get("/feed",async (req,res)=>{
//     try{
//         const users=await User.find({}) ;
//         res.send(users);
//     }
//     catch(err){
//         res.status(400).send("Somethimg went wrong"+err);
//     }
// })

// // for getting profile data
// app.get("/profile",userAuthForToken,async (req,res)=>{
// try{
//     // instaed of writing all the code here we have used midddleware which are in models/userAuthForToken
//     // userAuthForToken is the midddleware after execting of this middleware only the requset ahnlder function will be eectuted and sends the resposne
//     const logedInUser=req.user;
//     res.send(logedInUser);
// }
// catch(err){
//     res.status(400).send("Error "+err.message);
// }
// })

// // delete te user data from a database
// app.delete("/user",async (req,res)=>{
//     const userId=req.body.userId
//     try{
//         // const user=await User.findByIdAndDelete({_id:userId});
//         const user=await User.findByIdAndDelete(userId); 
//         // you can use any one of the above two two statements both are same
//         res.send("User deleted sucessfullty")
//     }
//     catch(err){
//         res.status(400).send("Unable to delete the user data");
//     }
// })


// // updating the user data
// app.patch("/updateuser/:userId", async (req,res)=>{
//     // const userId=req.body.userId;
//     const userId=req.params.userId;
//     // if you want to read userId you can follow any one of them in above mentioned ,second one is by reading userId from url by adding
//     // /:userId as /updateUser/:userId or directle giving in req.body and taking from it as req.body.userId
//     const data=req.body;
//     try{
//       const allowedKeys=["userId","skills","age","gender","firstName","lastName","password"]
//       const allow=Object.keys(data).every(x=>allowedKeys.includes(x))
//       console.log(allow)
//       if(!allow){
//         throw new Error("Unable to update this filed");
//         // this error will be thrown to catch block
//       }
//     // here we are doing api level vlaidations were writing code for what are allowed to update 
//     // Obejct.keys will get all the keys from data(req.body) and every() will iterate over each key and check each value of this keys are present in allowed keys or not
//     // if all the keys are present it return true if not false.(every() will retrun a single boolean value (true or false) )   
//       if(data?.skills.length>15){
//           throw new Error("You can add upto 15 skills only");
//         //   ?. is optianl chaining, if we try to add more than 15 skills it will throw an error
//       }
//     //   from line 92 to line 101 this is used for api level validattion and this is nothing but data sanitization
//     // if we done some validation in Schema as adding trim, required,unique etc.. this si Scheam level validations  
//       const user=await User.findByIdAndUpdate({_id:userId},data);
//     //   const user=await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"before"});
//     // if we try to add the data the new fields that is not present in schema(document) before then it will not be added to database here only the alrady present fields wiil be updated 
//     // {returnDocument:"before"} it is used to get the data that is just before updated(means old data just before updation)
//       console.log(user);
//       res.send("The user data have been updated successfully"); 
//     }
//     catch(err){
//         res.status(400).send("Unable to update the user data "+err.message);
//     }
// })


// connectDb().then(()=>{
//     console.log("Database connection is established sucessfullly"); 
//     app.listen(4000,()=>{
//         console.log("Server is running on port 4000");
//     })
//     // now see we are getting coonection with dtabase first and then serevr is running on port 4000 to listen to requests.
// })
// .catch((err)=>{
//     console.log(err+"Database cannot be connected")
// })





// // ❌ Without await → you get Promises instead of real data → leads to bugs or crashes

// // ✅ With await → waits for the result → your code works correctly