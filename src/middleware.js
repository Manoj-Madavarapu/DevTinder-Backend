const express=require("express");

const app=express();

const {adminAuth,userAuth}=require("./middlewares/auth")

// middleware 
// to know more about middleware just see below
// app.get("/admin/getData",(req,res,next)=>{
//    console.log("Middleware for authentication");
// //    const token="xyz";
//    const token="xyzjnjn";
// //    to check unauthorized request
//    const isAuthorized=token==="xyz";
//    if(isAuthorized){
//     res.send("Data have been fetched")
//    }
//    else{
//     res.status(401).send("Unautorized request")
//    }
// })

// app.get("/admin/deleteData",(req,res,next)=>{
//    console.log("Middleware for authentication");
//    const token="xyz";
// //    const token="xyzcskj"
//    const isAuthorized=token==="xyz";
//    if(isAuthorized){
//     res.send("Data have been deleted")
//    }
//    else{
//     res.status(401).send("Unautorized request")
//    }
// })

// instead of writing in seperate seperate route handler for handling authentication if we use it is bettter to write in a single as a middleware function.
// if we use app.use("/admin") it will match with all the methods if you wnat to match with particular methodat the you acna go with app.get() or post ot delete or etc.. 

// app.use("/admin",(req,res,next)=>{
//    console.log("Middleare for authentication");
//    const token="manoj";
//    const isAuthorized=token==="manoj";
//    if(!isAuthorized){
//     res.status(401).send("Unauthorized request")
//    }
//    else{
//     next();
//    }
// })
//    the above is an middleware function
// it is like if we enter an wrong password(token) or wrong pin u will not able to get data or delete data  
// this function code will be executed first if the path is /admin and goes to next route handler based on complete path

// writing middlewares in advance way
app.use("/admin",adminAuth);
// actulaly in projects you create middlewares by creating a middleware folder and in that write code for middleware and export from them and import wherver required. And us ehenm as shwn above

app.get("/admin/getData",(req,res,next)=>{
    res.send("Data have been fetched") 
})
app.get("/admin/deleteData",(req,res)=>{
    res.send("Data has been deleted")
})

// app.use("/user",userAuth,(req,res)=>{
//     res.send("Login in successfully by using use()")
// })

app.get("/user/login",(req,res)=>{
    res.send("Login in successfully")
})

app.get("/user/data",userAuth,(req,res)=>{
    res.send("user data fetched")
})
// you can pass middleware as in above way also if you wnat to use middleware for one api only



app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})

// if you u wnat to run this file just go to package .json and change the scripts in that add this file path to run to dev field.  
