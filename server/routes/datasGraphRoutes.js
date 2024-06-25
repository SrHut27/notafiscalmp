const express = require("express");
const router = express.Router();

const {getTopFiveEmitentes, 
    getValorByDataEmissao, 
    getValorNotasAnoMes} = require("../controllers/datasGraphControllers");

router.get("/top5", (req, res) => {
    getTopFiveEmitentes(req, res);
});

router.get("/data", (req, res) => {
    getValorByDataEmissao(req, res)
});

router.get("/dados", getValorNotasAnoMes);

module.exports = router;