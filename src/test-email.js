// test-email-final.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const mailOptions = {
  from: process.env.SMTP_USER,
  to: 'SEU EMAIL',
  subject: 'Teste Final SMTP',
  text: 'Se recebeu isso, está funcionando!'
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.sendMail(mailOptions)
  .then(info => console.log('E-mail enviado:', info.response))
  .catch(err => console.error('Erro crítico:', err));