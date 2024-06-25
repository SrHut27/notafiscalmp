const express = require("express");
const router = express.Router();
const upload = require("../configs/uploader_config");

const {addFile, searchData, deleteFile} = require("../controllers/filesControllers");

// Rota controle:
const {verifyToken} = require("../controllers/authController");

router.post("/add",  verifyToken, upload.single("file"), addFile);

router.post("/delete/:notaID", verifyToken, deleteFile);

router.get("/search", searchData);


module.exports = router;