const { createAdmin } = require('../functions/createAdmin');

const tableDatas = `
CREATE TABLE IF NOT EXISTS datas (
    id SERIAL PRIMARY KEY,
    cnpj VARCHAR(255),
    emitente VARCHAR(255),
    numeracao INT,
    data_emissao DATE,
    valor_nota FLOAT,
    data_registro DATE,
    valor_credito FLOAT,
    situacao_credito VARCHAR(255),
    admin_responsavel VARCHAR(255) NOT NULL
)
`;

const tableUsers = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    reset_password VARCHAR(255) DEFAULT NULL,
    admin BOOLEAN DEFAULT FALSE,
    first_pass BOOLEAN DEFAULT TRUE
)
`;

const tableEdicao = `
CREATE TABLE IF NOT EXISTS edicoes (
    id SERIAL PRIMARY KEY,
    administrador VARCHAR(255) NOT NULL,
    estado VARCHAR(255) NOT NULL,
    quantidade VARCHAR(255) NOT NULL,
    data TIMESTAMP DEFAULT Now()
)
`;

const tableMetas = `
CREATE TABLE IF NOT EXISTS metas (
    id SERIAL PRIMARY KEY,
    mes INT NOT NULL,
    ano INT NOT NULL,
    meta_credito FLOAT NOT NULL,
    meta_notas INT NOT NULL,
    administrador VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT Now()
)
`

const createTables = async (connection) => {
    try {
        await connection.query(tableDatas);
        console.log("TABELA DADOS - PRONTA");

        await connection.query(tableUsers);
        console.log("TABELA USERS - PRONTA");

        const adminQueryResult = await connection.query("SELECT * FROM users WHERE admin = true");

        if (adminQueryResult.rows.length === 0) {
            console.log("Nenhum administrador encontrado. Criando administrador primário...");
            await createAdmin();
        }

        await connection.query(tableEdicao);
        console.log("TABELA EDIÇÕES - PRONTA");

        await connection.query(tableMetas);
        console.log("TABELA METAS - PRONTAS");
        
    } catch (error) {
        console.error("ERRO AO CRIAR TABELAS:", error);
    }
};

module.exports = { createTables };
