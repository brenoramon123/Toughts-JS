const express = require("express");
const router = express.Router()
const AuthController = require("../controllers/authController");

router.get("/login",AuthController.login);
router.post("/login",AuthController.loginPost);
router.get("/register",AuthController.register);
router.post("/register",AuthController.registerPost);
router.get("/logout",AuthController.logOut);





module.exports = router