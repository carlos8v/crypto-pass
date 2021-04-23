const { readFileSync } = require('fs');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');

module.exports = function SendMailService() {
  const state = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  }

  async function send(to, subject, path, info) {
    const template = readFileSync(path).toString('utf8');
    const newAccountTemplate = handlebars.compile(template);
    const html = newAccountTemplate(info);

    const transporter = nodemailer.createTransport(state);
    
    await transporter.sendMail({
      from: 'crypto-pass <noreply@cryptopass.com>',
      to,
      subject,
      html,
    });
  }

  return {
    send,
  }
};
