const mongoose=require("mongoose");

// mongoose.connect("mongodb+srv://ManojMadavarapu/kjcnkjbkjk/manojdatabase.wfaqgfr.mongodb.net/")
// you can just connect in this way also but this is not the best practise, have an async function as shown below this will be the best way

const connectDb=async()=>{
    // await mongoose.connect("mongodb+srv://ManojMadavarapu:s0XJodmFliPZeBSB@manojdatabase.wfaqgfr.mongodb.net/devTinder")
      await mongoose.connect(process.env.DATABASE_URL)
}
// in url after .net/  a last if you wnat you can specify your database name 
// connectDb().then(()=>{
//     console.log("Database connection is established sucessfullly")
// })
// .catch((err)=>{
//     console.log(err+"Database cannot be connected")
// })

// if we doo in this way first server will be running and listen to requets before the datbase is getting connected soo first you have to coonect to the datbase and tehn the server should be able to listen the requests to doo we have to export this  connectDb to app.js

module.exports=connectDb