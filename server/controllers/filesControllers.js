const connection = require("../configs/database_connection");
const excel = require("exceljs");
const path = require("path");

// Importando funções necessárias para formatar dados de entrada na hora de adicionar uma tabela:
const {formatData, parseCurrency} = require("../functions/inDataTypeFormat");

// Importando as opções de edições:
const {edicoesDisponiveis, quantidadesDisponiveis} = require("../utils/edicoes_actions");

const addFile = async (req, res) => {
    console.log(req.decoded);

    const userAdmin = req.decoded.name;

    const file = req.file;

    if (!file) {
        res.status(400).json({
            error: `Precisa enviar um arquivo para prosseguir...`
        });
        return;
    }

    try {
        const workbook = new excel.Workbook();

        try {
            await workbook.xlsx.readFile(file.path);
        } catch (err) {
            try {
            await workbook.csv.readFile(file.path);
            } catch (error) {
                res.status(400).json({
                    error: "Formato de arquivo não suportado. Envie um arquivo CSV ou XLSX..."
                });
                return;
            }
        }

        const worksheet = workbook.getWorksheet(1);

        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
                if (rowNumber !== 1) {
                    const rowData = {
                        cnpj: row.getCell(1).value,
                        emitente: row.getCell(2).value,
                        numeracao: row.getCell(3).value,
                        data_emissao: formatData(row.getCell(4).value),
                        valor_nota: parseCurrency(row.getCell(5).text),
                        data_registro: formatData(row.getCell(6).value),
                        valor_credito: parseCurrency(row.getCell(7).text)
                    };
                    rows.push(rowData);
                };
        });

        for (const row of rows) {
            const queryInsert = "INSERT INTO datas (cnpj, emitente, numeracao, data_emissao, valor_nota, data_registro, valor_credito, admin_responsavel) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
            const querySelect = "SELECT * FROM datas WHERE cnpj = $1 AND emitente = $2 AND numeracao = $3 AND data_emissao = $4 AND valor_nota = $5 AND data_registro = $6 AND valor_credito = $7";
            
            const data = [row.cnpj, row.emitente, row.numeracao, row.data_emissao, row.valor_nota, row.data_registro, row.valor_credito];

            const existingData = await connection.query(querySelect, data);

            if (existingData.rows.length === 0) {
                await connection.query(queryInsert, [...data, userAdmin]);
            } 
        }

        await connection.query("INSERT INTO edicoes (administrador, estado, quantidade) VALUES ($1, $2, $3)", [userAdmin, edicoesDisponiveis[0], quantidadesDisponiveis[1]]);

        console.log("Dados adicionado com sucesso")
        res.status(200).json({
            resultado: "Dados adicionados com sucesso!"
        })

    } catch (error) {
        console.log("Erro ao adicionar dados ao banco de dados:", error);
        res.status(500).json({
            error: `Não foi possível conectar com o banco de dados`
        })
        return;
    }

}

// Apagar notas individualmente por ID:
const deleteFile = async (req, res) => {
    console.log(req.decoded);
    const {notaID} = req.params;

    try {
        await connection.query("DELETE FROM datas WHERE id = $1", [notaID]);

        const adminName = req.decoded.name;

        await connection.query("INSERT INTO edicoes (administrador, estado, quantidade) VALUES ($1, $2, $3)", [adminName, edicoesDisponiveis[2], quantidadesDisponiveis[0]]);

        res.status(200).json({
            resultado: `Nota apagada com sucesso!`
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: `Não foi possível conectar ao banco de dados`
        });
        return;
    }
}

const searchData = async (req, res) => {
    const { valor, valorMenor, emitente, valorCredito, valorCreditoMenor } = req.query;

    if (!valor && !valorMenor && !emitente && !valorCredito && !valorCreditoMenor) {
        res.status(400).json({
            error: `Digite um valor permitido em pelo menos um campo para pesquisar por nota`
        });
        return;
    }

    let query = "SELECT * FROM datas WHERE 1=1";
    let data = [];
    let paramIndex = 1;

    if (valor) {
        query += ` AND valor_nota >= $${paramIndex}`;
        data.push(valor);
        paramIndex++;
    }

    if (valorMenor) {
        query += ` AND valor_nota <= $${paramIndex}`;
        data.push(valorMenor);
        paramIndex++;
    }

    if (emitente) {
        query += ` AND emitente ILIKE $${paramIndex}`;
        data.push(`%${emitente}%`);
        paramIndex++;
    }

    if (valorCredito) {
        query += ` AND valor_credito >= $${paramIndex}`;
        data.push(valorCredito);
        paramIndex++;
    }

    if (valorCreditoMenor) {
        query += ` AND valor_credito <= $${paramIndex}`;
        data.push(valorCreditoMenor);
        paramIndex++;
    }

    try {
        const result = await connection.query(query, data);

        if (result.rows.length === 0) {
            res.status(400).json({ error: `Não há nenhuma nota com as informações fornecidas` });
            return;
        }

        res.status(200).json({ resultado: result.rows });
    } catch (error) {
        console.log("Erro ao buscar dados:", error);
        res.status(500).json({ error: `Não foi possível conectar com o banco de dados` });
        return;
    }
};


module.exports = {addFile, searchData, deleteFile}