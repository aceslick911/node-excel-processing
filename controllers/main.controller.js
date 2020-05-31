const multer = require("multer");
const XLSXWriteStream = require("xlsx-write-stream");
const storageCustom = require("./customStorageEngine");
const os = require("os");

const chpro = require("child_process");

// for custom multer storage
let upload = multer({
  storage: storageCustom({
    key: (req, file, cb) => {
      cb(null, fullPath);
    },
  }),
});

exports.getSheetInfo = (req, res) => {
  let spawn = chpro.spawn;
  if (os.type() === "Windows_NT") spawn = require("win-spawn");

  let filename =
    "/Users/angeloperera/Downloads/Content Master UK - MAR 2020.xlsx"; //path.join(osenv.tmpdir(), "_" + Date.now());
  let spawnArgs = [];
  spawnArgs.push("--list-sheets");
  spawnArgs.push(filename);

  let child = spawn(require.resolve("j/bin/j.njs"), spawnArgs);
  child.on("exit", function (code, sig) {
    if (code === null || code !== 0) {
      child.stderr.pipe(
        concat(function (errstr) {
          console.log("error", errstr);
        })
      );
    }
  });

  res.setHeader("Content-Type", "application/text");

  child.stdout.pipe(res);
};

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
    const startTime = Number(new Date());
    xlsxStream.on("finish", () =>
      console.log(
        `Pipe ended. Time taken: ${(Number(new Date()) - startTime) / 1000}s`
      )
    );

    xlsxStream.pipe(res);
  });
};
