const nodemailer=require("nodemailer");

const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:"manojmadavarapu4997@gmail.com",
        pass:"nbsf phpc zdgs sbeu"
    }
})
// host and port are the fixed values we give for gmail
// in pass you have to pass appPassword dfrom Email account

const handleSendEmail=async (toEmail,subject,html)=>{
const options={
    from:"manojmadavarapu4997@gmail.com",
    // to:"manojmadavarapu7@gmail.com",
    to:toEmail,
    subject,
    html
}
try{
    const info=await transporter.sendMail(options);
    console.log("Email Sent");
}
catch(error){
    console.log(error);
}
}

module.exports={handleSendEmail}