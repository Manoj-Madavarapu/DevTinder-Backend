const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        // it is filed that stores the objectId(if we want to store an objectId of other user then we use this(moongose.Schema.Types.ObjectId))
        ref:"User",
        // ref is used to make connections between two collections (ref="User") means it make refering to User collections(as we have foriegn key in sql)
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`,
        }
        // enum is used ti specify the allowed values for that particular field
    }
},
{timestamps:true}
);

// this is like a middleware that will be exectuted just before connectionRequest.save() (save() is called) the 
connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send request to your self (from schema)")
    }
    next();
});
// in above you should not use  arrow function callback function

const ConnectionRequest=mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports={ConnectionRequest}