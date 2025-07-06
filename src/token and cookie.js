const express=require("express");
const connectDb=require("./config/database")
const {User}=require("./models/user");
const {validatingData}=require("./utils/validation");
const validator=require("validator");
const bcrypt=require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt=require("jsonwebtoken");
const app=express();


app.use(express.json());
app.use(cookieParser());
// it is used for reading the cookies and it is like a middleware as above expres.json()
// if we dont use this and try to read the cookie then we will get output as undefined

app.post("/signup",async (req,res)=>{
    console.log(req.body);
    try{
    const {firstName,lastName,email,password}=req.body;
    // validation of data
    validatingData(req);
   const passwordHash=await bcrypt.hash(password,10);
   console.log(passwordHash);
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
    if(passwordisValid){

        // create an JWT token
        // JWT stand sfor jsonweb token it consits of theree parts header payload and signature
        const token=await jwt.sign({_id:user._id},"Manoj@123");
        // console.log(token);
        // jsonwebtoken is used fro crating and valiadting the tokens jwt.sign() is usd for creating the token first paarmeter {_id:user._id} is the hiding data and second paarmeter is like a secret code 
        // here we have created a token and store in in cookie and sending it along with response as shown below
        // add cookie with token.
        // jwt.sign({_id:user._id},"Manoj@123",{expiresIn:"1d"});
        // expiresIn is used for expireing the token we can pass 1d or 7d means (d--day) or 1h or 2h h means hour etc..

        res.cookie("token",token);
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

// get the user data from database
app.get("/user",async (req,res)=>{
    const emailId=req.body.email;
    // in this we will store the email that we got from frontend
    try{
        const user=await User.findOne({email:emailId}) ;
        if(!user){
              // if we enter wrong emilid then this eexecutes
            res.send("User not found");
        }
        else{
            res.send(user);
        }
    }
    catch(err){
        res.status(400).send("Somethimg went wrong"+err);
    }
})

// if you want to get all the data of users from database then do this
app.get("/feed",async (req,res)=>{
    try{
        const users=await User.find({}) ;
        res.send(users);
    }
    catch(err){
        res.status(400).send("Somethimg went wrong"+err);
    }
})

// for getting profile data
app.get("/profile",async (req,res)=>{
    // whenver we perform any operation or action or any api call the sever wnat to know whaetehr it is doen by user or not and it is you or not
    // soo to do soo  it will send the cookie when we doo any api call tehn the server will validate the cookie and verify whether it is you or not as shown below 
try{
    const cookie=req.cookies;
    // console.log(cookie);
    // first we are taking the cookie from request (you know to read cookies we use cookie-parser)
    const {token}=cookie;
    // console.log(token);
    // here are destucturing the token from then cookie 
    if(!token){
        throw new Error("Token not found");
    }

    const verifyToken=await jwt.verify(token,"Manoj@123");
    console.log(verifyToken);
    // here we are verifing teh token by usin g jwt.verify 
    // you know ewe have given user Id as an hiding data while craeting the token, wehen we verify the token we getb output as { _id: '6846cc0122fb8f8a60c4fa07', iat: 1749554931 }, from this vefiedToken we are taking userid and based on that we are finding the deatils of logined in user
    const {_id}=verifyToken;
    const logedInUser=await User.findById(_id);
    if(!logedInUser){
        throw new Error("User data not found Please login again")
    }
    res.send(logedInUser);
}
catch(err){
    res.status(400).send("Error "+err.message);
}
})

// delete te user data from a database
app.delete("/user",async (req,res)=>{
    const userId=req.body.userId
    try{
        // const user=await User.findByIdAndDelete({_id:userId});
        const user=await User.findByIdAndDelete(userId); 
        // you can use any one of the above two two statements both are same
        res.send("User deleted sucessfullty")
    }
    catch(err){
        res.status(400).send("Unable to delete the user data");
    }
})


// updating the user data
app.patch("/updateuser/:userId", async (req,res)=>{
    // const userId=req.body.userId;
    const userId=req.params.userId;
    
    const data=req.body;
    try{
      const allowedKeys=["userId","skills","age","gender","firstName","lastName","password"]
      const allow=Object.keys(data).every(x=>allowedKeys.includes(x))
      console.log(allow)
      if(!allow){
        throw new Error("Unable to update this filed");
        // this error will be thrown to catch block
      }
      if(data?.skills.length>15){
          throw new Error("You can add upto 15 skills only");
        //   ?. is optianl chaining, if we try to add more than 15 skills it will throw an error
      }
      const user=await User.findByIdAndUpdate({_id:userId},data);
    //   const user=await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"before"});
    // if we try to add the data the new fields that is not present in schema(document) before then it will not be added to database here only the alrady present fields wiil be updated 
    // {returnDocument:"before"} it is used to get the data that is just before updated(means old data just before updation)
      console.log(user);
      res.send("The user data have been updated successfully"); 
    }
    catch(err){
        res.status(400).send("Unable to update the user data "+err.message);
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


