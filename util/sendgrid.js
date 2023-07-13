const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport(sendGridTransport({
  auth:{
    api_key: process.env.API_KEY
  }
}))

exports.sendEmail =(email,responce)=>{
  transporter.sendMail({
    to:email,
    from:'testingyourotp@gmail.com',
    subject:`Responce Of Your Submisson on Problem`,
    html:`${JSON.stringify(responce)}`
  })
}