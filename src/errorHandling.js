const express=require("express");

const app=express();


app.get("/user",(req,res,next)=>{
    // try{
    throw new Error("bshhbsdkjgkjfskj")
    // this line is used to just create an error
    res.send("user Data has fetched")
    // }
    // catch(err){
    //    res.status(500).send("Sommething went please contact support team")
    // }
})
// the best way to handle the errors is try and catch only
// but if some differnet error occiured to handle them just write below 4 lines of code
app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send(" Something went wrong")
    }
})
// remember when you are passing parameters you have to pass in this order only,the first will be considered as 1:error, 2nd:request, 3rd:response, 4th:next. 

// if i place this 4 lines of code in above at first it will not be excecuted becuase there error will be generated at first only when it comes inside app.get("/user") in that error is getting generated


app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})

// if you want to run this file just require this file path in app.js as require("./errorHandling.js")