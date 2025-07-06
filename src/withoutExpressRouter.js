const express=require("express");
const connectDb=require("./config/database")
const {User}=require("./models/user");
const {validatingData}=require("./utils/validation");
const validator=require("validator");
const bcrypt=require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt=require("jsonwebtoken");
const app=express();
const {userAuthForToken}=require("./middlewares/anthFortokens");


app.use(express.json());
app.use(cookieParser());


app.post("/signup",async (req,res)=>{
    // creating a new Instance of the User modal
    // creating a new instance is nothing but creating a new document
    // const user=new User({
    //     firstName:"Manoj",
    //     lastName:"Madavarapu",
    //     email:"manoj@gmail.com",
    //     password:"Hii",
    //     age:22,
    // });
    // instead of giving this data directly we can give data that we got from frontend
    console.log(req.body);
    // req.body will give you the data that you got from apis(means from frontend which is present in postman in body, raw and in json) 
    // this will be undefined if you dont use express.json() middleware
    try{
    const {firstName,lastName,email,password}=req.body;
    // validation of data
    validatingData(req);
    // above we are validatingData data by using validatingData function from utils/ validation.js 
    
    // Encrypt the password
    // encrypt is nothing but instaed of storing password direcltly in database it encrypts it into long string and stores it in database
   const passwordHash=await bcrypt.hash(password,10);
   console.log(passwordHash);
//    bcrypt.hash(password,10)==>1st aparameter is password(plain text passowrd) and 2nd paramter is salt rounds
// It tells bcrypt how many times to process the data. Higher numbers mean more secure ,but takes more time for hashing and validating also.10 is a commonly used salt rounds and it is balanced value.

    // const user=new User(req.body);
    // instead if giveing in this way thsi is the best way
    const user=new User({
        firstName,
        lastName,
        email,
        password:passwordHash
    })

    await user.save();
    // This will insert the user data into the users collection in MongoDB.
    res.send("Data have been succefully added")
    }
    catch(err){
        res.status(500).send("Error "+err.message)
    }
})

// for login
app.post("/login", async (req,res)=>{
try{
    const {email,password}=req.body;
    if(!validator.isEmail(email)){
        throw new Error("Enter correct email");
    }
    const user=await User.findOne({email:email});
    // it will check for entered email is present in database or not,if present it will return entire user object(in user variabel now enrite user object dat awill be present)
    if(!user){
        throw new Error("Invalid credentials");
    }
    const passwordisValid=await bcrypt.compare(password,user.password);
    // it will decrypt the password in database and check with entered passowrd and return true or false
    //  const passwordisValid=await user.validatePassword(password);
    // the above line is sue dfor making the code clean and resuable and moere effiecient by writing the code in user.js in models as usrschema.methods and issue them as above
    if(passwordisValid){

        // create an JWT token
        // JWT stand sfor jsonweb token it consits of theree parts header payload and signature
        const token=await jwt.sign({_id:user._id},"Manoj@123",{expiresIn:"7d"});
        //    const token=await user.getJWT();// ===>if you want you can this or aboev line 
        // console.log(token);
        // jsonwebtoken is used fro crating and valiadting the tokens jwt.sign() is usd for creating the token first paarmeter {_id:user._id} is the hiding data and second paarmeter is like a password
        // here we have created a token and store in in cookie and sending it along with response as shown below
        // add cookie with token.
        // jwt.sign({_id:user._id},"Manoj@123",{expiresIn:"7d"});
        // expiresIn is used for expireing the token we can pass 1d or 7d means (d--day) or 1h or 2h h means hour etc..
        // if you pass expiresIn:"0d" you can it expies immediatly after cretaing the tou send any requets you will erro as Error jwt expired
        res.cookie("token",token);
        // for expiring the cookie use {expires: new Date(Date.now())} in this way as re.cookie("token",token, {expires: new Date(Date.now())})
        res.send("Login successfull !");
    }
    else{
        throw new Error("Invalid credentials password");
    }
}
catch(err){
    res.status(400).send("Error "+err.message);
}
})


// for getting profile data
app.get("/profile",userAuthForToken,async (req,res)=>{
try{
    // instaed of writing all the code here we have used midddleware which are in midddlewares/userAuthForToken
    // userAuthForToken is the midddleware after execting of this middleware only the requset ahnlder function will be eectuted and sends the resposne
    const logedInUser=req.user;
    res.send(logedInUser);
}
catch(err){
    res.status(400).send("Error "+err.message);
}
})


app.post("/sendConnectionRequest",userAuthForToken,async (req,res)=>{
    // if i dont use the midddleware here if we are loge dout also we can send the the reque st where itsvis bacd parctise soo 
    // to avoid these we use middleware whcich consists of authentication code which allow use to send send connection request oif teh taht aprticular user is only logined in 
   try{
     console.log("Connection request send");
     const user=req.user;
      res.send(user.firstName+" has send teh connection requests")
   }
   catch(err){
    res.status(400).send("Error "+err.message);
   }
})


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