const nodemailer=require("nodemailer");

const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.APP_PASSWORD
    }
})
// host and port are the fixed values we give for gmail
// in pass you have to pass appPassword dfrom Email account

const handleSendEmail=async (toEmail,subject,html)=>{
const options={
    from:process.env.EMAIL_USER,
    // to:"manojmadavarapu7@gmail.com",
    to:toEmail,
    subject,
    html
}
try{
    const info=await transporter.sendMail(options);
    console.log("Email Sent");
    console.log("Email"+process.env.EMAIL_USER)
    console.log("Password"+process.env.APP_PASSWORD)
}
catch(error){
    console.log(error);
}
}

module.exports={handleSendEmail}