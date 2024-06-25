const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../configs/database_connection");
const { 
    sendPasswordResetEmail, 
    sendPasswordResetConfirmationEmail, 
    generateResetToken, 
    sendWelcomeEmail 
} = require("../utils/email_functions");

const generatePass = require("../functions/generatePassword");

require("dotenv").config();

// Controllers
const registerControll = async (req, res) => {
    const {name, lastName, email, admin} = req.body;

    if (!name || !lastName || !email || admin === undefined) {
        res.status(400).json({
          error: `Se deseja continuar o cadastro, informe todos os dados necessários.`,
        });
        return;
    }

    try {
        const existingUser = await connection.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (existingUser.rows.length > 0) {
            res.status(400).json({
                error: `Já existe um usuário com os dados informados...`
            });
            return;
        } else {
            const password = generatePass();
            const hashPassword = await bcrypt.hash(password, 10);

            await connection.query("INSERT INTO users (name, last_name, email, password, admin) VALUES ($1,$2,$3,$4,$5)", [name, lastName, email, hashPassword, admin]);

            sendWelcomeEmail(email, password);

            res.status(200).json({
                resultado: `O usuário ${name + " " + lastName} foi adicionado com sucesso. Boas vindas! Um email foi enviado ao novo usuário com sua senha temporária.`
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: `No momento não foi possível contatar o servidor. Tente novamente mais tarde...`
        });
    }
};

const loginControll = async (req, res) => {
    const { email, password, novaSenha, confirmarSenha } = req.body;

    if (!email || !password) {
        res.status(400).json({
            error: `Se deseja logar no sistema, informe todos os dados necessários...`
        });
        return;
    }

    try {
        const existingUser = await connection.query("SELECT * FROM users WHERE email = $1", [email]);

        if (existingUser.rows.length === 0) {
            res.status(400).json({
                error: `Nenhuma conta registrada com o email fornecido.`
            });
            return;
        } else {
            const user = existingUser.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                res.status(400).json({
                    error: `Senha digitada incorreta.`,
                });
                return;
            }

            if (user.first_pass) {
                if (!novaSenha || !confirmarSenha) {
                    res.status(400).json({
                        error: `Para a primeira senha, é necessário informar a nova senha e sua confirmação.`,
                        firstPass: user.first_pass 
                    });
                    return;
                }

                if (novaSenha !== confirmarSenha) {
                    res.status(400).json({
                        error: `As senhas não coincidem.`,
                    });
                    return;
                }

                const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                if (!passwordRegex.test(novaSenha)) {
                    res.status(400).json({
                        error: `A senha deve conter pelo menos 8 caracteres, incluindo pelo menos um número, uma letra maiúscula, uma letra minúscula e um caractere especial.`,
                    });
                    return;
                }

                const hashedNewPassword = await bcrypt.hash(novaSenha, 10);
                await connection.query("UPDATE users SET password = $1, first_pass = $2 WHERE email = $3", [hashedNewPassword, false, email]);

                res.status(200).json({
                    user: { ...user, first_pass: false },
                    firstPass: false
                });
                return;
            }

            const { password: userPassword, ...userToClient } = user;

            const expiresIN = "3h";
            const token = jwt.sign({name: user.name + " " + user.last_name, email: user.email, admin: user.admin}, process.env.SECRET, {
                expiresIn: expiresIN,
            });

            req.session.user = userToClient;

            res.status(200).json({
                user: userToClient,
                token: token,
                expiresIn: expiresIN,
                firstPass: user.first_pass,
                admin: user.admin
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: `No momento não foi possível contatar o servidor. Tente novamente mais tarde...`
        });
    }
};

const forgotPasswordControll = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(403).json({ error: 'Se deseja recuperar a senha, informe seu email de cadastro...' });
    }

    try {
        const existingEmail = await connection.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingEmail.rows.length === 0) {
            return res.status(403).json({ error: `O email ${email} não foi encontrado...` });
        } else {
            const resetToken = generateResetToken();
            const userID = existingEmail.rows[0].id;

            await connection.query('UPDATE users SET reset_password = $1 WHERE id = $2', [resetToken, userID]);
            sendPasswordResetEmail(email, resetToken);

            return res.status(200).json({ resultado: `Foi enviado um email de recuperação de senha para o endereço: ${email}` });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'No momento, não é possível estabelecer uma conexão com o banco de dados' });
    }
};

const resetPasswordPOST = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
        if (!password || !confirmPassword) {
            return res.status(403).json({ error: 'Se deseja recuperar sua senha, informe todos os dados necessários' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'As senhas não coincidem. Por favor, tente novamente.' });
        }

        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'A senha deve conter pelo menos 8 caracteres, incluindo pelo menos um número, uma letra maiúscula, uma letra minúscula e um caractere especial.' });
        }

        const exisitngResetToken = await connection.query('SELECT * FROM users WHERE reset_password = $1', [token]);

        if (exisitngResetToken.rows.length === 0) {
            return res.status(403).json({ error: 'Não há recuperação de senha para esta conta.' });
        } else {
            const userID = exisitngResetToken.rows[0].id;
            const userEmail = exisitngResetToken.rows[0].email;

            const hashedPassword = await bcrypt.hash(password, 10);
            await connection.query('UPDATE users SET password = $1, reset_password = NULL WHERE id = $2', [hashedPassword, userID]);

            sendPasswordResetConfirmationEmail(userEmail);

            return res.status(200).json({ resultado: 'Sua senha foi alterada com sucesso!' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'No momento, não foi possível estabelecer uma conexão com o banco de dados' });
    }
};

const logoutControll = async (req, res) => {
    try {
        req.session.destroy(); 
        res.status(200).json({ message: "Logout realizado com sucesso." });
    } catch (error) {
        console.error("Erro no logout:", error);
        res.status(500).json({ error: "Erro ao realizar logout." });
    }
};

// Middleware de verificação de token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.decoded = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado." });
    }
};


module.exports = { 
    registerControll, 
    loginControll, 
    verifyToken, 
    forgotPasswordControll, 
    resetPasswordPOST, 
    logoutControll 
};
