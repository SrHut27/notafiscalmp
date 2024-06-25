const express = require("express");
const router = express.Router();

const {getTopEmitentes, 
    getValorByDataEmissao, 
    getValorNotasAnoMes} = require("../controllers/datasGraphControllers");

router.get("/top-emitentes", (req, res) => {
    getTopEmitentes(req, res);
});

router.get("/data", (req, res) => {
    getValorByDataEmissao(req, res)
});

router.get("/dados", getValorNotasAnoMes);

module.exports = router;