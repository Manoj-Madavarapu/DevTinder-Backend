const validator=require("validator");
function validatingData(req){
    const {firstName,lastName,password,email,gender}=req.body;
    if(!firstName){
        throw new Error("First Name is required")
    }
    else if(!lastName){
        throw new Error("Last Name is required")
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is required")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error('Password must be strong (min 8 chars, uppercase, lowercase, number, symbol)')
    }
    else if(!gender){
        throw new Error("Please seelct your Gender")
    }
}

const validatingEditProfileData=(req)=>{
    const allowedEditFields=["firstName","lastName","age","skills","about","gender","photoUrl","role"];
    const isvalid=Object.keys(req.body).every((field)=>allowedEditFields.includes(field))
    return isvalid;
}
module.exports={validatingData,validatingEditProfileData}