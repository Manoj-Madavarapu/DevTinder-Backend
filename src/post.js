const express=require("express");
const connectDb=require("./config/database")
const {User}=require("./models/user")
// require("./config/database");
const app=express();

app.use(express.json());
// app.use("/",()=>{})===> this wotks only for that matching routes(if we passs route it will run for matchning routes for alal then type of methods)
// app.use(()=>{})===> this runs on all the routes ( if we dont pass any path then this runs on all the kind of routes and all the types of routes )
// express.json() is middleware 
// is used to conevrt the json data into js object from the body of http requests.
// if we dont use this then req.body will be undefined

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
    // req.body will give you the data taht you got from apis(means from frontend) 
    // this will be undefined if you dont use express.json() middleware
    const user=new User(req.body);
    try{
    await user.save();
    // This will insert the user data into the users collection in MongoDB.
    res.send("Data have been succefully added")
    }
    catch(err){
        res.status(500).send("Error"+err.message)
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


// if you wnat to run this just require this filr in app.js file and type npm run dev in terminal.