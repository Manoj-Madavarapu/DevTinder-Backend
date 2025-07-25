const express=require("express");
const authRouter=express.Router();
// express.Router is a function thai sgiven by express
// instead of writing all the api calls(routes) in app.js to make trh code clean we use express.router() 
// for in this we ahve make all the auth routers means teh routes (api calls) that are ued for authentication sucha as signup and login
const {User}=require("../models/user");
const jwt=require("jsonwebtoken");
const validator=require("validator")
const {validatingData}=require("../utils/validation");
const bcrypt=require("bcrypt");
const templates=require("../utils/emailTemplates");
const { handleSendEmail } = require("../utils/sendingEmail");



authRouter.post("/signup",async (req,res)=>{
    console.log(req.body);
    try{
    const {firstName,lastName,email,password,gender}=req.body;
    // validation of data
    validatingData(req);
    
   const passwordHash=await bcrypt.hash(password,10);
   console.log(passwordHash);

    const user=await new User({
        firstName,
        lastName,
        email,
        password:passwordHash,
        gender
    })
    
    const savedUser=await user.save();
    //  const token=await jwt.sign({_id:user._id},"Manoj@123",{expiresIn:"7d"});
    const token=await savedUser.getJWT();// ===>if you want you can this or above line 
    res.cookie("token",token,
        {
          httpOnly: true,
          secure: true,              // important for Render (HTTPS)
          sameSite: "None",          // important for cross-origin
        }
    );

    // sending Email after signup
    const {subject,html}= templates.signupSuccessEmail(firstName+" "+lastName);
    handleSendEmail(email,subject,html);
    // tmeplates is for showing different templates for signup and sending requesta nd accepting requst (from templates we are taking subject and html and passing thema s paramters to handleSend Emil funtion (dont confuse the functions in emailTemplates file return the output as object soo we ahve detuscture the subject and html from returned output))
    // and handleSendEmail is used to caal the nodemailer funtion and send the emails  

    res.send(savedUser);
    }
    catch(err){
        res.status(500).send("Error "+err.message)
    }
})


// for login
authRouter.post("/login", async (req,res)=>{
try{
    const {email,password}=req.body;
    if(!validator.isEmail(email)){
        throw new Error("Enter correct email");
    }
    const user=await User.findOne({email:email});
    if(!user){
        throw new Error("Invalid credentials");
    }
    const passwordisValid=await bcrypt.compare(password,user.password);
    // it will decrypt the password in database and check with entered passowrd and return true or false
    //  const passwordisValid=await user.validatePassword(password);
    // the above line is used for making the code clean and resuable and moere effiecient by writing the code in user.js in models as usrschema.methods and issue them as above
    if(passwordisValid){
        const token=await jwt.sign({_id:user._id},"Manoj@123",{expiresIn:"7d"});
        //    const token=await user.getJWT();// ===>if you want you can this or aboev line 
       
        res.cookie("token",token,
            {
              httpOnly: true,
              secure: true,              // important for Render (HTTPS)
              sameSite: "None",          // important for cross-origin
            //   maxAge: 24 * 60 * 60 * 1000 // 1 day
            }
        );
        // for expiring the cookie use {expires: new Date(Date.now())} in this way as re.cookie("token",token, {expires: new Date(Date.now())})
        res.send(user);
    }
    else{
        throw new Error(": Invalid credentials");
    }
}
catch(err){
    res.status(400).send("Error "+err.message);
}
})

// logout api
authRouter.post("/logout",async (req,res)=>{
    // to logout we just need to expires the cookie and make the token empty
    // this cookie will juts expires at the mooment it is created
    res.cookie("token",null,{
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires:new Date(Date.now())
    });
    res.send("User Logout Sucessfully!! ")
})

module.exports={authRouter}