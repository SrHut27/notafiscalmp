const express = require("express");
const router = express.Router();

// Rota controle:
const {verifyToken} = require("../controllers/authController");

// Importando controles:
const { 
    addMeta,
    searchMeta,
    deleteMeta,
    ultimaMeta,
    todasMetas
    } = require("../controllers/metasController");

router.post("/add", verifyToken, addMeta);

router.get("/", searchMeta);
router.post("/", searchMeta);

router.post("/delete/:metaID", verifyToken, deleteMeta);

router.get("/ultima", ultimaMeta);

router.get("/todas", todasMetas);

module.exports = router;