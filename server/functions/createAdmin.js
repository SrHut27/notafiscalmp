const readline = require('readline');
const bcrypt = require('bcrypt');
const connection = require("../configs/database_connection");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const createAdmin = async () => {
  try {
    const name = await askQuestion('Nome: ');
    const lastName = await askQuestion('Sobrenome: ');
    const email = await askQuestion('Email: ');
    const password = await askQuestion('Senha: ');
    const confirmPassword = await askQuestion('Confirmar Senha: ');

    if (password !== confirmPassword) {
      console.log('As senhas não coincidem. Tente novamente.');
      rl.close();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      "INSERT INTO users (name, last_name, email, password, reset_password, admin, first_pass) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [name, lastName, email, hashedPassword, null, true, false]
    );

    console.log('Administrador primário criado com sucesso!');
  } catch (error) {
    console.log('Erro ao criar administrador primário:', error);
  } finally {
    rl.close();
  }
};

module.exports = { createAdmin };
