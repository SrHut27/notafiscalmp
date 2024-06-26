const express = require("express");
const router = express.Router();

// Rota controle:
const {verifyToken} = require("../controllers/authController");

// Importando controles:
const { 
    addMeta,
    searchMeta,
    deleteMeta
    } = require("../controllers/metasController");

router.post("/add", verifyToken, addMeta);

router.get("/", searchMeta);
router.post("/", searchMeta);

router.post("/delete/:metaID", deleteMeta);

module.exports = router;