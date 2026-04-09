const express = require("express");
const { login, forgotPassword, signup } = require("../auth");

const router = express.Router();

// Route: POST /api/auth/login
router.post("/login", login);

// Route: POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// Route: POST /api/auth/signup
router.post("/signup", signup);

module.exports = router;
