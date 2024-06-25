const connection = require("../configs/database_connection");

const getTopEmitentes = async (req, res) => {
    const { mes, ano, limit = 5 } = req.query;

    try {
        let query = `
            SELECT emitente, SUM(valor_credito) AS total_credito
            FROM datas
            WHERE emitente IS NOT NULL
        `;

        if (mes && ano) {
            query += ` AND EXTRACT(MONTH FROM data_emissao) = ${mes} AND EXTRACT(YEAR FROM data_emissao) = ${ano}`;
        }

        query += ` GROUP BY emitente ORDER BY total_credito DESC LIMIT ${limit}`;

        const topEmitentes = await connection.query(query);

        if (topEmitentes.rows.length === 0) {
            res.status(400).json({ error: "Não há dados para mostrar..." });
        } else {
            res.status(200).json({ resultado: topEmitentes.rows });
        }
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        res.status(500).json({ error: "Não foi possível conectar com o banco de dados" });
    }
}


const getValorByDataEmissao = async (req, res) => {
    try {
        const { year, month } = req.query;

        let startDate;
        let endDate;

        if (year && month) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 1);
        } else {
            const queryUltimoMes = `
                SELECT DISTINCT date_trunc('month', data_emissao) AS ultimo_mes
                FROM datas
                WHERE data_emissao IS NOT NULL
                ORDER BY ultimo_mes DESC
                LIMIT 1
            `;
            const ultimoMesResult = await connection.query(queryUltimoMes);

            if (ultimoMesResult.rows.length === 0) {
                res.status(400).json({
                    error: `Não há dados para mostrar...`
                });
                return;
            }

            startDate = ultimoMesResult.rows[0].ultimo_mes;
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
        }

        const query = `
            SELECT data_emissao, 
                   SUM(valor_credito) AS total_valor_credito 
            FROM datas 
            WHERE data_emissao IS NOT NULL 
              AND data_emissao >= $1
              AND data_emissao < $2
            GROUP BY data_emissao 
            ORDER BY data_emissao ASC 
            LIMIT 31
        `;

        const byDataEmissao = await connection.query(query, [startDate, endDate]);

        if (byDataEmissao.rows.length === 0) {
            res.status(400).json({
                error: `Não há dados para mostrar...`
            });
            return;
        } else {
            res.status(200).json({
                resultado: byDataEmissao.rows,
            });
        }
    } catch (error) {
        console.log("Erro ao buscar dados:", error);
        res.status(500).json({ error: `Não foi possível conectar com o banco de dados` });
        return;
    }
};

const getValorNotasAnoMes = async (req, res) => {
    try {
        const { year, month } = req.query;

        // Se year ou month não for fornecido, pega o último mês registrado
        if (!year && !month) {
            const queryUltimoMes = `
                SELECT date_trunc('month', data_emissao) AS mes,
                       SUM(valor_credito) AS total_credito,
                       COUNT(*) AS total_notas
                FROM datas
                WHERE data_emissao IS NOT NULL
                GROUP BY mes
                ORDER BY mes DESC
                LIMIT 1
            `;
            const result = await connection.query(queryUltimoMes);

            if (result.rows.length === 0) {
                res.status(400).json({
                    error: `Não há dados para mostrar...`
                });
                return;
            }

            res.status(200).json({
                resultado: result.rows[0],
            });
        } else {
            // Se o ano for fornecido sem o mês, pega todos os meses do ano
            if (year && !month) {
                const queryAno = `
                    SELECT date_trunc('month', data_emissao) AS mes,
                           SUM(valor_credito) AS total_credito,
                           COUNT(*) AS total_notas
                    FROM datas
                    WHERE data_emissao IS NOT NULL
                      AND EXTRACT(YEAR FROM data_emissao) = $1
                    GROUP BY mes
                    ORDER BY mes ASC
                `;
                const result = await connection.query(queryAno, [year]);

                if (result.rows.length === 0) {
                    res.status(400).json({
                        error: `Não há dados para mostrar...`
                    });
                    return;
                }

                res.status(200).json({
                    resultado: result.rows,
                });
            } else if (year && month) {
                // Se o ano e o mês forem fornecidos, pega os dados do mês específico
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 1);

                const queryMes = `
                    SELECT data_emissao,
                           SUM(valor_credito) AS total_credito,
                           COUNT(*) AS total_notas
                    FROM datas
                    WHERE data_emissao IS NOT NULL
                      AND data_emissao >= $1
                      AND data_emissao < $2
                    GROUP BY data_emissao
                    ORDER BY data_emissao ASC
                `;
                const result = await connection.query(queryMes, [startDate, endDate]);

                if (result.rows.length === 0) {
                    res.status(400).json({
                        error: `Não há dados para mostrar...`
                    });
                    return;
                }

                res.status(200).json({
                    resultado: result.rows,
                });
            } else {
                res.status(400).json({
                    error: `Parâmetros inválidos fornecidos...`
                });
            }
        }
    } catch (error) {
        console.log("Erro ao buscar dados:", error);
        res.status(500).json({ error: `Não foi possível conectar com o banco de dados` });
        return;
    }
};



module.exports = {getTopEmitentes, getValorByDataEmissao, getValorNotasAnoMes}