const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "mail.dat.co.ke",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.user,
    pass: process.env.password,
  },
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
  },
});
transport.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log(success);
  }
});

function sendMail(subject, email, content) {
  return transport.sendMail({
    from: process.env.user,
    to: email,
    subject: subject,
    html: content,
  });
}

//send email

exports.sendMail = sendMail;
