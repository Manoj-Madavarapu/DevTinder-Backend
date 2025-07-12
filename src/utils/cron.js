const { subDays, startOfDay, endOfDay } = require("date-fns");
let cron=require("node-cron");
const { ConnectionRequest } = require("../models/connectionRequest");
const { pendingRequestEmail } = require("./emailTemplates");
const { handleSendEmail } = require("./sendingEmail");


// this is a cron job code for sending Emails at moring 8 clock if they have any pending connetcion requets 
cron.schedule("0 8 * * *", async()=>{
    //  console.log("cron jobs"+new Date());
    try{
        const yesterday=subDays(new Date(), 1);
        // subDays will subtract 1 one day(specified days) from prsent date 

        const yesterDayStart=startOfDay(yesterday);
        const yesterdayEnd=endOfDay(yesterday);
        // starto fthe day and end of the day will helpyou get the startinf \g of and ending of thet day 
        // from ths we can find the all the request createdAt yesterday 

        const pendingRequests= await ConnectionRequest.find({
            status:"interested",
            createdAt:{
                $gt:yesterDayStart,
                $lt:yesterdayEnd
            }
        }).populate("fromUserId toUserId","firstName lastName email")
        // console.log(pendingRequests)
        // this wiil give the data of pendingRequests of yesterday 

        const listOfEmails=[...new Set(pendingRequests.map(req=>req.toUserId.email))]
        // console.log(listOfEmails)
        // from the pendingRequests we are taking the emails out by maping them and removing the duplicates by using Set and used ...(spread opertor) to spread them intoa n individual array (the reson behind removing duplicates emils is , to avoid sending multiple emils to the same user(email)) 

        for(const email of listOfEmails){
            const {subject,html}=pendingRequestEmail();
            await handleSendEmail(email,subject,html)
        }
        // in this for of loop we are iterating over each email of listOfEmails and giving to handleSendEmail to send emial to all the email ids

    }
    catch(err){
        console.log(err)
    }
})

// cron job is used for scheduling the task and run them in specific interval  
// crontab guru---you can goo through this to know more about cron String( * * * * *)
