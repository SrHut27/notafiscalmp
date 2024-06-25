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
`

const createTables = (connection) => {

    connection.query(tableDatas)
    .then(() => console.log("TABELA DADOS - PRONTA"))
    .catch((error) => console.log("TABELA DADOS - ERRO:", error));
    
    connection.query(tableUsers)
    .then(() => console.log("TABELA USERS - PRONTA"))
    .catch((error) => console.log("TABELA USERS - ERRO:", error));

    connection.query(tableEdicao)
    .then(() => console.log("TABELA EDIÇÕES - PRONTA"))
    .catch((error) => console.log("TABELA EDIÇÕES - ERRO:", error))
}
module.exports = {createTables}