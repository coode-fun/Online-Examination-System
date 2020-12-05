var nodemailer = require('nodemailer');

module.exports=function Mailed(email,id)
{
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.emailpassword
  }
});

var mailOptions = {
  from: 'gbye8334@gmail.com',
  to: `${email}`,
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
  html: `<h1>Welcome</h1><p>That was easy!</p><p><a href='http://192.168.43.183:5000/verify/${id}'>CLICK TO ACTIVATE</p>`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}