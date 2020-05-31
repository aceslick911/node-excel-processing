const express = require("express");
const Router = express.Router;
const router = Router();

const controller = require("./main.controller");

// router for processing excel
router.post("/processExcel", controller.processExcel);
router.get("/info", controller.getSheetInfo);

module.exports = router;
