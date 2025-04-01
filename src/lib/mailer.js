// lib/mailer.js
const nodemailer = require('nodemailer');

// Configuração do transporter (substitua TODO o conteúdo existente por isso)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    ciphers: 'SSLv3' // Adicione essa linha se estiver usando Outlook/Hotmail
  }
});

module.exports = {
  sendMail: async (message) => {
    try {
      await transporter.sendMail({
        ...message,
        from: message.from || 'CE-Artesanato <no-reply@ceartesanato.com.br>'
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  }
};