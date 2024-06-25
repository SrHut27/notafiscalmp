const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurando o EMAil, para recuperação de senha e aprovação de usuário
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;