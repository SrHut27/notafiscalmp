const express = require("express");
const router = express.Router();

// Importando controles:
const { 
    registerControll, 
    loginControll, 
    verifyToken, 
    forgotPasswordControll, 
    resetPasswordPOST, 
    logoutControll 
} = require("../controllers/authController");

router.post("/register", (req, res) => {
    registerControll(req, res);
});

router.post("/login", (req, res) => {
    loginControll(req, res);
});

router.get("/logout", logoutControll);

router.post("/forgot-password", (req, res) => {
    forgotPasswordControll(req, res);
});

router.post("/reset-password/:token", (req, res) => {
    resetPasswordPOST(req, res);
});

router.get('/verify-token', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token válido.' });
});

module.exports = router;
