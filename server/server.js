const express = require("express");
const fs = require("fs");
const cors = require("cors");
const oracledb = require("oracledb");
const dbConfig = require("./dbConfig.js");
const queries = require("queryStrings.js")
const app = express();

const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let libPath;
if (process.platform === "win32") {
  // Windows
  libPath = "C:\\oracle\\instantclient_19_12";
} else if (process.platform === "darwin") {
  // macOS
  libPath = process.env.HOME + "/Downloads/instantclient_19_8";
}
if (libPath && fs.existsSync(libPath)) {
  oracledb.initOracleClient({ libDir: libPath });
}

async function run() {
  let connection;

  try {

    connection = await oracledb.getConnection({
      user: "aausek",
      password: "Ausek6493",
      connectString: "//oracle.cise.ufl.edu/orcl",
    });
    
    // For a complete list of options see the documentation.
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };

    app.get("/home/:number", async (req, res) => {
      let sql, binds, options, result;
      sql = `SELECT * 
            FROM nmoody9899.crime
            FETCH FIRST ${req.params.number} ROWS ONLY`;

      binds = {};
      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };
      result = await connection.execute(sql, binds, options);
      res.send(result.rows);
    });
  } catch (err) {
    console.error(err);
  }
}

run();

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

process.on("SIGINT", function () {
  console.log("\nStopping server (Ctrl-C)");
  process.exit(0);
});
