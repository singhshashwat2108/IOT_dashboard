const express = require("express");
const { login, forgotPassword } = require("../auth");

const router = express.Router();

// Route: POST /api/auth/login
router.post("/login", login);

// Route: POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

module.exports = router;
