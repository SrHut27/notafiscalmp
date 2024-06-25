const express = require("express");
const router = express.Router();
const { 
    notasDoadas,
    ultimaEdicao,
    todasEdicoes,
    totalNotasCadastradas,
    tresMesesCreditoNotas,
    totalCredito  } = require("../controllers/dashboardControllers");

router.get("/valor", notasDoadas);
router.post("/valor", notasDoadas);

router.get("/ultimaedicao", ultimaEdicao);

router.get("/todasedicoes", todasEdicoes);

router.get("/todasnotas", totalNotasCadastradas);

router.get("/totalcredito", totalCredito);

router.get("/tresmeses", tresMesesCreditoNotas);

module.exports = router;
