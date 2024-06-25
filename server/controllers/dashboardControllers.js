const connection = require("../configs/database_connection");

const notasDoadas = async (req, res) => {
    const { mes, ano } = req.method === "GET" ? req.query : req.body;

    if (!mes || !ano || mes < 1 || mes > 12 || ano < 2023) {
        res.status(400).json({
            error: `Para pesquisar o total de notas doadas, selecione um ano a partir de 2023 e um mês entre 1 e 12`,
        });
        return;
    }

    try {
        const queryTotalNotas = `
            SELECT SUM(valor_credito) AS total_notas
            FROM datas
            WHERE EXTRACT(MONTH FROM data_emissao) = $1 AND EXTRACT(YEAR FROM data_emissao) = $2
        `;

        const queryTotalNotasCadastradas = `
            SELECT COUNT(id) AS total_notas_cadastradas
            FROM datas
            WHERE EXTRACT(MONTH FROM data_emissao) = $1 AND EXTRACT(YEAR FROM data_emissao) = $2
        `;

        const resultTotalNotas = await connection.query(queryTotalNotas, [mes, ano]);
        const resultTotalNotasCadastradas = await connection.query(queryTotalNotasCadastradas, [mes, ano]);

        if (resultTotalNotas.rows.length === 0 || resultTotalNotas.rows[0].total_notas === null) {
            res.status(400).json({
                error: `Não há dados para o mês e ano especificados.`,
            });
            return;
        } else {
            const valor_total_notas = resultTotalNotas.rows[0].total_notas;
            const total_notas_cadastradas = resultTotalNotasCadastradas.rows[0].total_notas_cadastradas;

            res.status(200).json({
                resultado: {
                    valor_total_notas,
                    total_notas_cadastradas
                },
            });
        }
    } catch (error) {
        console.log("Erro ao buscar dados:", error);
        res.status(500).json({ 
            error: `Não foi possível conectar com o banco de dados`
         });
         return;
    }
};


const ultimaEdicao = async (req, res) => {
    try {
        const query = `
            SELECT * FROM edicoes
            ORDER BY data DESC
            LIMIT 1
        `;

        const ultimaEdicao = await connection.query(query);

        if (ultimaEdicao.rows.length === 0) {
            res.status(404).json({
                error: "Não há nenhuma edição para mostrar",
            });
            return;
        }

        res.status(200).json({
            resultado: ultimaEdicao.rows
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Não foi possível conectar com o banco de dados",
        });
        return;
    }
}

const todasEdicoes = async (req, res) => {
    try {
        const todasEdicoes = await connection.query(`
            SELECT * FROM edicoes 
            ORDER BY data DESC;
            `);

        if (todasEdicoes.rows.length === 0) {
            res.status(404).json({
                error: "Não há nenhuma edição para mostrar",
            });
            return;
        }

        res.status(200).json({
            resultado: todasEdicoes.rows,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Não foi possível conectar com o banco de dados",
        });
        return;
    }
};

const totalNotasCadastradas = async (req, res) =>{
    try {
    const totalNotas = await connection.query(`
        SELECT COUNT(id) AS total_notas_cadastradas
        FROM datas`
    )

    if (totalNotas.rows.length === 0) {
        res.status(404).json({
            error: "Nenhum dado para mostrar..."
        });
        return;
    } else {
        res.status(200).json({
            resultado: totalNotas.rows, 
        })
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Não foi possível conectar com o banco de dados",
        });
        return;
    }
};

const totalCredito = async (req, res) => {
    try {   
        const totalDeCredito = await connection.query(`
            SELECT SUM(valor_credito) AS total_credito 
            FROM datas
            WHERE emitente IS NOT NULL`);

        if (totalDeCredito.rows.length === 0) {
            res.status(404).json({
                error: "Não há resultados para mostrar...",
            });
            return;
        } else {
            res.status(200).json({
                resultado: totalDeCredito.rows,
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Não foi possível conectar com o banco de dados",
        });
        return;
    }
}


const tresMesesCreditoNotas = async (req, res) => {
    try {
        const query = `
            WITH meses_recentes AS (
                SELECT DISTINCT
                    EXTRACT(MONTH FROM data_emissao) AS mes,
                    EXTRACT(YEAR FROM data_emissao) AS ano
                FROM datas
                ORDER BY ano DESC, mes DESC
                LIMIT 7
            )
            SELECT 
                EXTRACT(MONTH FROM data_emissao) AS mes,
                EXTRACT(YEAR FROM data_emissao) AS ano,
                SUM(valor_credito) AS total_credito,
                COUNT(id) AS total_notas
            FROM datas
            JOIN meses_recentes ON EXTRACT(MONTH FROM data_emissao) = meses_recentes.mes AND EXTRACT(YEAR FROM data_emissao) = meses_recentes.ano
            GROUP BY EXTRACT(MONTH FROM data_emissao), EXTRACT(YEAR FROM data_emissao)
            ORDER BY ano, mes
        `;

        const result = await connection.query(query);

        if (result.rows.length === 0) {
            res.status(404).json({
                error: "Não há dados para mostrar nos últimos três meses",
            });
            return;
        }

        res.status(200).json({
            resultado: result.rows,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Não foi possível conectar com o banco de dados",
        });
    }
};


module.exports = { notasDoadas, ultimaEdicao, todasEdicoes, totalNotasCadastradas, tresMesesCreditoNotas, totalCredito };
