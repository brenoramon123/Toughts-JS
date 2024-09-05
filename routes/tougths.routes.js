const express = require("express");
const router = express.Router()
const checkAuth = require("../helpers/auth");

const ToughtController = require("../controllers/Toughtscontroller")

router.get("/dashboard",checkAuth,ToughtController.dashboard)
router.post("/add",checkAuth,ToughtController.createToughtSave)

router.get("/",checkAuth,ToughtController.showAll)
router.get("/add",ToughtController.createTought)
router.post("/remove",checkAuth,ToughtController.deleteTought)
router.get("/edit/:id",checkAuth,ToughtController.updateTought)
router.post("/edit",checkAuth,ToughtController.updateToughtSave)





module.exports = router