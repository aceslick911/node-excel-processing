const Router = require("express").Router;
const router = Router();

const controller = require("./main.controller");

// router for processing excel
router.post("/processExcel", controller.processExcel);
router.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
  <TITLE>Excel Stream</TITLE>
  </head>
  <body>
  <form action="/processExcel" method="POST" enctype="multipart/form-data">
  <input type="file" value="file" name="file" />
  <input type="submit" value="Submit"/>
  </form>
  </body>
  </html>
  `);
});

module.exports = router;
