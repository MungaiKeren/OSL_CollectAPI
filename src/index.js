require("dotenv").config();
const express = require("express");
const sequelize = require("./configs/connection");
const cookieParser = require("cookie-parser");
const env = require("./configs/env");
const Auth = require("./libs/Auth/Auth.route");
const Mobile = require("./libs/Mobile/Mobile.route");
const ReportsRoutes = require("./libs/Reports/Reports.route");
const ToolsList = require("./libs/ToolsList/ToolsList.route");
const Questions = require("./libs/Questions/Questions.route");
const sqlInjectionCheck = require("./SQLInjectionMiddleware");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const request = require("request");
const path = require("path");

const app = express();
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.send(200);
  } else {
    return next();
  }
});

app.use(sqlInjectionCheck);

// Dev Mode
app.use(function (req, res, next) {
  if (req.url.includes("/api")) {
    req.url = req.url.toString().replace("/api", "");
  }
  if (req.method === "POST" || req.method === "PUT") {
    myCache.flushAll();
  }
  next();
});

app.get("/uploads/:fileName", function (req, res) {
  const customFilename = decodeURIComponent(req.params.fileName);

  const filePath = path.join(__dirname, "../uploads/", customFilename);

  res.download(filePath, customFilename);
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/ol", express.static(path.join(__dirname, "public/ol")));
app.use(
  express.json({ limit: "50mb", extended: true, parameterLimit: 1000000 })
);

app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 1000000 })
);

//geoserver
app.use(function (req, res, next) {
  if (req.url.split("/")[1] === "geoserver") {
    req.pipe(request(`http://demo.osl.co.ke:442${req.url}`)).pipe(res);
  } else {
    next();
  }
});

app.get("/thumbnails/:fileName", async function (req, res) {
  const pdfPath = path.join(__dirname, "../uploads/", req.params.fileName);
  const command = `pdftoppm -png -f 1 -l 1 "${pdfPath}" output`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      res.sendStatus(500);
      return;
    }

    // Send the converted image as a response
    res.sendFile("output-1.png", { root: "./" }, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        res.sendStatus(500);
      }
    });
  });
  //res.sendFile(result.path);
});

app.get("/map", (req, res) => {
  res.render("map");
});

//reports
app.get("/myreports/alltables", async function (req, res) {
  try {
    const [data, dmeta] = await sequelize.query(
      `SELECT table_name,table_schema FROM information_schema.tables
        WHERE table_type = 'BASE TABLE' AND table_schema = 'tools';`
    );
    const [data1, d1meta] = await sequelize.query(
      `SELECT table_name,table_schema FROM information_schema.tables
        WHERE table_type = 'BASE TABLE' AND table_name = 'ARFs' 
        OR table_name = 'TAFs' OR table_name = 'RMFs' 
        OR table_name = 'IndicatorPerformances' OR table_name = 'WaterProviders';`
    );
    data.unshift(...data1);
    res.status(200).json(data);
  } catch (error) {
    res.status(203).json([]);
  }
});

app.get("/myreports/tablecolumns/:table/:schema", async function (req, res) {
  try {
    const [data, dmeta] = await sequelize.query(
      `SELECT column_name
FROM information_schema.columns
WHERE table_schema = '${req.params.schema}' AND table_name = '${req.params.table}';
`
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(203).json([]);
  }
});

app.post(
  "/myreports/getdata/:table/:schema/:offset",
  async function (req, res) {
    try {
      let query = "";

      const body = req.body;
      if (body?.filters && body?.filters?.length > 0) {
        body.filters.map((item) => {
          let d = "";
          if (item.operator == "ILIKE") {
            d = `"${item.column}"::text ${item.operator} '%${item.value}%'::text`;
          } else
            d = `"${item.column}"::text ${item.operator} '${item.value}'::text`;

          if (query != "") query += " AND " + d;
          else query += d;
        });
        query = "WHERE " + query;
      }

      const [data, meta] = await sequelize.query(
        `SELECT * FROM ${req.params.schema}."${req.params.table}" ${query}`
      );

      res.status(200).json(data);
    } catch (error) {
      res.status(203).json([]);
    }
  }
);
//reports

Auth.AuthRoutes(app);
Mobile.MobileRoutes(app);
ReportsRoutes.ReportsRoutes(app);
ToolsList.ToolsListRoutes(app);
Questions.QuestionsRoutes(app);

app.listen(env.port, function () {
  console.log("app listening at port %s", env.port);
});
