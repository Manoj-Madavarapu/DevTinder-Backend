const mongoose=require("mongoose");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email "+value);
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password "+value);
            }
        }
    },
    role:{
        type:String,
        minLength:3,
        maxLength:150,
    },
    age:{
        type:Number,
        // required:true,
        min:18
        // if the type is string then we have to use minLength or maxLength
        // if the type is number then w ehave to use min or max 
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Error invalid data");
                // if we enter different values other than above mention values then it will throw an error 
            }
        }
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL "+value);
            }
        },
        // default:"https://as1.ftcdn.net/v2/jpg/07/24/59/76/1000_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg"
        // default:"https://i.pinimg.com/736x/57/00/c0/5700c04197ee9a4372a35ef16eb78f4e.jpg"
    },
    about:{
       type:String,
       default:"Passionate about building innovative solutions and collaborating with talented teams."
    //    by default this data will be added if we dont give also fro about section
    },
    skills:{
        type:[String],
        validate(value){
            if(value.length>15){
                throw new Error("You can only add upto 15 skills")
            }
            const uniqueSkills = new Set(value);
            if (uniqueSkills.size !== value.length) {
              throw new Error("Duplicate skills are not allowed.");
            }
        }
    }
},{timestamps:true});
// here above {timestamps:true} this will give you the time and date of when you have added the user and when then you are updating the user 

// Schema defines the structure and rules of the documents stored in a MongoDB collection.
// It specifies the fields, data types etc..
// simply Schema is an bluprint of an model.

// model
// model is an interface that is use to interact with mongoDB
// It allows you to create, read, update, and delete documents from the associated MongoDB collection.
userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"Manoj@123",{expiresIn:"7d"});

    return token;
}
// if we use this we can make our code clean and reusable
// remeber here we should not use arrow functions in schema methods

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    // const passwordHash=user.password;

    const isValidatePassword=await bcrypt.compare(passwordInputByUser, user.password)
    return isValidatePassword;
}

userSchema.pre('save', function (next) {
  if (!this.photoUrl) {
    if (this.gender === 'male') {
      this.photoUrl = 'https://media.istockphoto.com/id/1327592389/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=kl9_IgA2ixssEdoXGJW7vuBh6lzL_RvYWgWB20TdzCA=';
    } else if (this.gender === 'female') {
      this.photoUrl = 'https://media.istockphoto.com/id/1327592564/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-woman.jpg?s=612x612&w=0&k=20&c=kqhekIAYrzVkY2hR4GsrsvfLcB_3JnpemBDRYlelof8=';
    } else {
      this.photoUrl = 'https://as1.ftcdn.net/v2/jpg/07/24/59/76/1000_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg';
    }
  }
  next();
});

const User=mongoose.model("User",userSchema);
// the first letter of varible name for model should be in capital letter
// and it accepts two paramets one is model name(eg:"User" like collection name) and the second parameter is Schema 

// if we want to say in a simple manner then as we have class and object in java in the same way class means Schema and model means object


module.exports={User}


//Concept	            Definition	                                    Example
// Schema	    Structure/blueprint of a document	            new mongoose.Schema({...})
// Model	  Interface to interact with the database	        mongoose.model('User', userSchema)


// Validator is a npm library that is used for all kind of validations eg email,passwords,url etcc..
// validator.isURL(value) is used for validating urls.