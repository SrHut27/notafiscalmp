// Importando as configurações de email:
const transporter = require("../configs/email_config");

function sendPasswordResetEmail(email, resetPass) {
  const mailOptions = {
    from: "notafiscal@mariaperegrina.com",
    to: email,
    subject: "Recuperação de Senha",
    html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                <p>Olá,</p>
                <p>Esqueceu sua senha no Sistema NOTA FISCAL Maria Peregrina, com o email: ${email}?</p>
                <p>Para redefinir sua senha, na página de recuperação, insira esse valor:</p>
                <a style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;" href="http://localhost:3000/auth/reset-password?token=${resetPass}"> Alterar Senha </a>
                <p style="margin-top: 20px;">Se você não solicitou uma redefinição de senha, ignore este email.</p>
                <p style="margin-top: 20px;">Atenciosamente,</p>
                <p style="font-weight: bold;">Sistema NOTA FISCAL Maria Peregrina</p>
            </div>
        `,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Erro ao enviar email de recuperação de senha: ", error);
    } else {
      console.log("Email de recuperação de senha enviado com sucesso.");
    }
  });
}

// Função para enviar o email de confirmação de alteração de senha
function sendPasswordResetConfirmationEmail(email) {
  const mailOptions = {
    from: "serviceemail@gmail.com",
    to: email,
    subject: "Confirmação de Alteração de Senha",
    html: `
            <p>Sua senha foi alterada com sucesso no SocialApp, com o email: ${email}.</p>
            <p>Se você não realizou esta alteração, entre em contato conosco imediatamente. Clique no link ou contate-nos pelo telefone: (17) XXXX-XXXX</p>
        `,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(
        "Erro ao enviar email de confirmação de alteração de senha: ",
        error
      );
    } else {
      console.log(
        "Email de confirmação de alteração de senha enviado com sucesso."
      );
    }
  });
}

// Função para gerar um token de redefinição de senha aleatório
function generateResetToken() {
  const tokenLength = 20;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < tokenLength; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

// Função para enviar email de boas-vindas com senha temporária
function sendWelcomeEmail(email, password) {
  const mailOptions = {
    from: "notafiscal@mariaperegrina.com",
    to: email,
    subject: "Boas-vindas ao Sistema NOTA FISCAL Maria Peregrina",
    html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                <p>Olá,</p>
                <p>Bem-vindo ao Sistema NOTA FISCAL Maria Peregrina!</p>
                <p>Sua conta foi criada com sucesso. Aqui estão suas credenciais temporárias:</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Senha Temporária:</strong> ${password}</p>
                <p>Por favor, faça login e altere sua senha na primeira vez que acessar o sistema.</p>
                <p>Atenciosamente,</p>
                <p style="font-weight: bold;">Sistema NOTA FISCAL Maria Peregrina</p>
            </div>
        `,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Erro ao enviar email de boas-vindas: ", error);
    } else {
      console.log("Email de boas-vindas enviado com sucesso.");
    }
  });
}

// Exportando as funções
module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
  generateResetToken,
  sendWelcomeEmail, 
}