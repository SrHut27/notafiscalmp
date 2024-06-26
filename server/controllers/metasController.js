const connection = require("../configs/database_connection");

const addMeta = async (req, res) => {
    const { mes, ano, valorCredito, valorNota } = req.body;

    const nameUser = req.decoded.name;

    if (!mes || !ano || !valorCredito || !valorNota) {
        res.status(400).json({
            error: "Se deseja inserir uma meta, informe todos os dados necessários",
        });
        return;
    }

    try {
        const existeMetaQuery = "SELECT * FROM metas WHERE mes = $1 AND ano = $2";
        const existeMetaData = [mes, ano];

        const existeMeta = await connection.query(existeMetaQuery, existeMetaData);

        if (existeMeta.rows.length > 0) {
            res.status(403).json({
                error: "Já existe uma meta para esse mês e ano.",
            });
            return;
        } else {
            const addMetaQuery = "INSERT INTO metas (mes, ano, meta_credito, meta_notas, administrador) VALUES ($1, $2, $3, $4, $5)";
            const addMetaData = [mes, ano, valorCredito, valorNota, nameUser];

            await connection.query(addMetaQuery, addMetaData);

            res.status(201).json({
                resultado: `Meta para o mês ${mes} do ano ${ano} adicionada com sucesso!`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Não foi possível conectar ao banco de dados. Tente novamente mais tarde.",
        });
        return;
    }
};

const searchMeta = async (req, res) => {
    const { mes, ano } = req.method === "GET" ? req.query : req.body;

    if (!mes || !ano) {
        res.status(400).json({
            error: "Se deseja buscar uma meta, selecione um mês e um ano",
        });
        return;
    }

    try {
        const metaQuery = "SELECT * FROM metas WHERE mes = $1 AND ano = $2";
        const metaData = [mes, ano];
        const metaResult = await connection.query(metaQuery, metaData);

        if (metaResult.rows.length === 0) {
            res.status(404).json({
                error: `Nenhuma meta encontrada para o mês ${mes} do ano ${ano}.`,
            });
            return;
        }

        const notasQuery = `
            SELECT 
                SUM(valor_credito) AS total_credito, 
                COUNT(*) AS total_notas 
            FROM datas
            WHERE EXTRACT(MONTH FROM data_emissao) = $1
            AND EXTRACT(YEAR FROM data_emissao) = $2
        `;
        const notasData = [mes, ano];
        const notasResult = await connection.query(notasQuery, notasData);

        res.status(200).json({
            metas: metaResult.rows,
            notas: notasResult.rows[0], // Summarized results
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Não foi possível conectar com o banco de dados. Tente novamente mais tarde.",
        });
        return;
    }
};


const deleteMeta = async (req, res) => {
    const {metaID} = req.params;

    try {
        const existeMeta = await connection.query("SELECT * FROM metas WHERE id = $1", [metaID]);

        if (existeMeta.rows.length === 0) {
            res.status(404).json({
                error: `Não foi encontrada nenhuma meta com os dados informados`,
            });
            return;
        } else {
            await connection.query("DELETE FROM metas WHERE id = $1", metaID);

            res.status(302).json({
                resultado: `A meta da data: ${mes+"/"+ano} foi apagada com sucesso!`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Não foi possível conectar com o banco de dados. Tente novamente mais tarde.",
        });
        return;
    }
}

module.exports = { addMeta, searchMeta, deleteMeta };