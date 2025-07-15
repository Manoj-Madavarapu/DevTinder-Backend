const express=require("express");
const paymentRouter=express.Router()
const Razorpay=require("razorpay");
const { userAuthForToken } = require("../middlewares/anthFortokens");
const { Payment } = require("../models/payment");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const { User } = require("../models/user");


var instance=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET_KEY
})
// the key_id and key_secret you will get it from your Razorpay accounts and settings 

// this api is used to create an api fro create orderId
paymentRouter.post("/payment/create",userAuthForToken,async (req,res)=>{
    try{
        const {firstName,lastName,email}=req.user;
        const membershipType=req.body.membershipType;
        // getting the membershiptype from frontend
        
        const amountPlans={
            Pro:100,
            VIP:200
        };
        const amount=amountPlans[membershipType]
        // for dynamix values we use [] not .(see after complte code to know more)

       const order= await instance.orders.create({
        amount,
        currency:"INR",
        receipt:"receipt#1",
        notes:{
            firstName,
            lastName,
            email,
            memebershipType:membershipType
        }
       });
    //    console.log(order)
    // by using these order details which is sent by razorapy i will crate and paymnet collection as shoen below

    // i have to save the payment details in the datbase
       const paymentOrderData=await new Payment({
        userId:req.user._id,
        orderId:order.id,
        status:order.status,
        amount:order.amount,
        currency:order.currency,
        receipt:order.receipt,
        notes:order.notes
       })
       const savedPaymentData=await paymentOrderData.save();

       res.send(savedPaymentData);

    }
    catch(err){
        res.status(400).send("Error "+err.message)
    }
})

// // this api is related to webhook where the razorapy will inform the backend about the paymentId and details of payment whether it is sucess or failed
// paymentRouter.post("/payment/webhook", express.raw({ type: "application/json" }),async(req,res)=>{
//     console.log("heloo webhook")
//     try{
//         const webhookSignature=req.get("X-Razorpay-Signature");

//         // const isWebhookValid= validateWebhookSignature(
//         //     JSON.stringify(req.body),
//         //     webhookSignature,
//         //     process.env.WEBHOOK_SECRET_KEY
//         //     // this is an secret key which you give while craetion of webhook in razporapy
//         // )
//         const payload = req.body.toString('utf8');
// const isWebhookValid = validateWebhookSignature(
//   payload,
//   webhookSignature,
//   process.env.WEBHOOK_SECRET_KEY
// );

//         if(!isWebhookValid){
//             console.log("❌ Invalid webhook signature!");
//             return res.status(400).json({msg:"Webhook signature is invalid"})
//         }
        
//         console.log("📦 Webhook payload:", req.body);
// console.log("🧾 Signature header:", webhookSignature);
// console.log("🔑 Using secret:", process.env.WEBHOOK_SECRET_KEY);

//         // update my payment status in DB
        
//         const paymentDetails=req.body.payload.payment.entity
//         console.log(paymentDetails)
// //      this si used to update the status of the payment details in payment colletion 
//         const payment=await Payment.findOne({orderId:paymentDetails.order_id})
//         payment.status=paymentDetails.status
//         await payment.save();

//         // updating the user as premium and his memberhipType
//         const user=await User.findOne({
//             _id:payment.userId
//         })
//         user.isPremium=true,
//         user.membershipType=payment.notes.memebershipType
//         await user.save()
//         console.log(user)

//         if(req.body.event==="payment.captured"){
//             console.log("payment sucess")
//         }
//          if(req.body.event==="payment.failed"){
//             console.log("payment failed")
//         }

//         // return sucess response to razorpay
//         return res.status(200).json({msg:"Webhook verified sucesfully"})

//     }
//     catch(err){
//       res.status(400).send(err.message)
//     }
// })

paymentRouter.post("/payment/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    console.log("📥 Received webhook");

    try {
        const webhookSignature = req.get("X-Razorpay-Signature");
        const payload = req.body.toString('utf8');

        const isWebhookValid = validateWebhookSignature(
            payload,
            webhookSignature,
            process.env.WEBHOOK_SECRET_KEY
        );

        if (!isWebhookValid) {
            console.log("❌ Invalid webhook signature!");
            return res.status(400).json({ msg: "Webhook signature is invalid" });
        }

        const data = JSON.parse(payload); // ✅ Parse the payload
        console.log("📦 Webhook payload:", data);

        const paymentDetails = data.payload.payment.entity;
        const eventType = data.event;

        // Update payment status
        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        if (!payment) {
            console.log("⚠️ Payment not found in DB");
            return res.status(404).json({ msg: "Payment not found" });
        }

        payment.status = paymentDetails.status;
        await payment.save();

        // Update user
        const user = await User.findOne({ _id: payment.userId });
        if (user) {
            user.isPremium = true;
            user.membershipType = payment.notes.memebershipType;
            await user.save();
        }

        if (eventType === "payment.captured") {
            console.log("✅ Payment success");
        }
        if (eventType === "payment.failed") {
            console.log("❌ Payment failed");
        }

        return res.status(200).json({ msg: "Webhook verified successfully" });
    } catch (err) {
        console.log("💥 Webhook error:", err.message);
        res.status(400).send(err.message);
    }
});



paymentRouter.get("/membership/verification",userAuthForToken,async(req,res)=>{
    try{
        const user=req.user
        const {firstName,lastName,email,isPremium,membershipType}=user
        if(user.isPremium){
            return res.json({firstName,lastName,email,isPremium,membershipType})
        }
        return res.send("Not a premium user")
    }
    catch(err){
        res.status(400).send("Error"+err.message)
    }
})

module.exports={paymentRouter}



// Bracket notation ([]) is for dynamic property names:
// When the property name is stored in a variable (like user input), you need to use 
// const membershipType = "Pro";
// console.log(amountPlans[membershipType]); // ✅ Works: 9900
// amountPlans["Pro"] // → 9900

