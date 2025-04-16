const nodemailer = require("nodemailer");

let sendEmail = async () => {
    
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,//change it
      secure: false,
      auth: {
        user:  process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    
    let message = {
      from: {
        name: "AniStream",
        address: process.env.EMAIL,
      },
      to:process.env.NOTIFY_EMAIL,
      subject: "Refresh Anime",
      text: "Your anime Series/Movies will be expiring soon. Please refresh them.",
    };
    
    const sendMail = async (transporter, message) => {
      await transporter.sendMail(message);
      console.log("Email Sent");
    };
    
    await sendMail(transporter, message);

};
let sendOTP = async (OTP,email) => {
    // console.log(email);
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,//change it
      secure: false,
      auth: {
        user:  process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    
    let message = {
      from: {
        name: "AniStream",
        address: process.env.EMAIL,
      },
      to:email,
      subject: "Verification Code (Anistream)",
      text: `Your OTP for verification is ${OTP}`,
    };
    
    const sendMail = async (transporter, message) => {
      await transporter.sendMail(message);
      // console.log("OTP Sent");
    };
    
    await sendMail(transporter, message);

};

module.exports = {sendEmail,sendOTP};