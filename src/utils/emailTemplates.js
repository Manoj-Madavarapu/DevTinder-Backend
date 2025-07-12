const signupSuccessEmail = (name) => ({
  subject: "Welcome to DevTinder 🤝",
  html: 
 `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; text-align: center; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #ff5733;">Hi ${name} 👋</h2>
      <p style="font-size: 16px;">You’ve successfully signed up on <strong>DevTinder</strong>!</p>
      <img src="cid:devTinderImage" alt="DevTinder Logo" style="width: 150px; margin: 20px auto; display: block;" />
      <p style="font-size: 15px;">Start connecting with developers who speak your thoughts 🚀</p>
      <a href="" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #ff5733; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
        Open DevTinder
      </a>
    </div>`
});


const connectionRequestEmail = (name, fromUser) => ({
  subject: `New Connection Request from ${fromUser} - DevTinder`,
  html: 
   `<div style="max-width: 600px; margin: auto; padding: 25px; font-family: 'Segoe UI', sans-serif; text-align: center; border: 1px solid #ddd; border-radius: 12px; background-color: #fdfdfd;">
      <h2 style="color: #ff4d4d;">Hey ${name} 👋</h2>
      <p style="font-size: 16px; margin-top: 10px;">
        <strong>${fromUser}</strong> has just sent you a connection request on <span style="color: #ff5733;"><strong>DevTinder</strong></span>! ✉️
      </p>
      <img src="cid:devTinderImage" alt="DevTinder" width="150px" style="margin: 20px auto; display: block; border-radius: 8px;" />
      <p style="font-size: 15px; margin-top: 10px;">
        Connect with people, build something great together. ✨
      </p>
      <a href="" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #ff5733; color: white; text-decoration: none; font-size: 12px; border-radius: 6px; cursor:pointer;">
        View Request
      </a>
      <p style="font-size: 13px; color: #888; margin-top: 25px;">You received this email because you're part of the DevTinder network 💻</p>
    </div>`
});

// const requestAcceptedEmail = (name, acceptedBy) => ({
//   subject: `Your Request Was Accepted 🎉`,
//   html: `
//     <div style="font-family:sans-serif; text-align:center">
//       <h3>Hi ${name} 👋</h3>
//       <p><strong>${acceptedBy}</strong> has accepted your connection request.</p>
//       <p>Start chatting and collaborating now!</p>
//       <button>Start Conversation</button>
//     </div>
//   `
// });

const pendingRequestEmail=()=>({
  subject:"👋 You Have New Connection Requests on DevTinder!",
  html:
   `<div style="max-width: 600px; margin: auto; padding: 25px; font-family: 'Segoe UI', sans-serif; text-align: center; border: 1px solid #ddd; border-radius: 12px; background-color: #fdfdfd;">
      <h2 style="color: #ff4d4d;">Hello DevTinder User 👋</h2>
      <p style="font-size: 16px; margin-top: 10px;">
        You have some new connection requests 
      </p>
      <img src="cid:devTinderImage" alt="DevTinder" width="150px" style="margin: 20px auto; display: block; border-radius: 8px;" />
      <p style="font-size: 15px; margin-top: 10px;">
         Please take a moment to respond and keep the spark going! 💖
      </p>
      <a href="" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #ff5733; color: white; text-decoration: none; font-size: 12px; border-radius: 6px; cursor:pointer;">
        Respond
      </a>
      <p style="font-size: 13px; color: #888; margin-top: 25px;">You received this email because you're part of the DevTinder network 💻</p>
    </div>
  `
})

module.exports = {
  signupSuccessEmail,
  connectionRequestEmail,
//   requestAcceptedEmail,
  pendingRequestEmail

};



// Case 1: ✅ Returning an object directly (✅ using ())
// const getObj = () => ({ name: 'Manoj' });
// console.log(getObj()); // { name: 'Manoj' }
// The () tells JavaScript: “This is not a block of code — it's an object to return.”

// Case 2: ❌ Without () (returns undefined)
// const getObj = () => { name: 'Manoj' };
// console.log(getObj()); // undefined