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
    html,
    attachments: [
        {
          filename: "devTinder.png",
          path:"public/devTinder.png",
          cid: "devTinderImage", 
        },
    ],
    // this attchments code is for giving path for the image to be displayed in the email
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