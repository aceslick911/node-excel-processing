const multer = require("multer");
const XLSXWriteStream = require("xlsx-write-stream");
const storageCustom = require("./customStorageEngine");

// for custom multer storage
let upload = multer({
  storage: storageCustom({
    key: (req, file, cb) => {
      cb(null, fullPath);
    },
  }),
});

exports.processExcel = (req, res) => {
  // add writer stream variable in req so it can be accessed from custom storage
  req.xlsxWriter = new XLSXWriteStream();
  let u = upload.single("file");

  console.log("starting upload");
  u(req, res, (err) => {
    if (err) {
      console.log(err);
      // An error occurred when uploading
      return res.send({
        success: false,
        message: err.message,
      });
    }

    console.log("Upload complete");

    //write excel file stream to res
    const xlsxStream = req.xlsxWriter.getOutputStream();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=test.xlsx");

    xlsxStream.pipe(res);
  });
};
