var nodemailer = require('nodemailer');

module.exports=function Mailed(email,id)
{
  console.log(email);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'gbye8334@gmail.com',
    pass: process.env.EMAILPASSWORD
   // pass: '**************'
  }
});

var mailOptions = {
  from: 'gbye8334@gmail.com',
  to: `${email}`,
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
  html: `<h1>Welcome</h1><p>That was easy!</p><p><a href='https://online-exam-2020.herokuapp.com/verify/${id}'>CLICK TO ACTIVATE</p>`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log("Email not sent , may be issue with internet connection.");
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}
