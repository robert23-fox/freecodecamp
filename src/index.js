// index.js
// where your node app starts

//init project
require("dotenv").config();
const express = require("express");
const app = express();

// // enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// // so that your API is remotely testable by FCC
const cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// static files:
app.use(express.static("public"));

//basic api route
const path = require("path");

// your route for serving index.html
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "index.html");
  res.sendFile(filePath);
});

//your first api end point
app.get("/api/hello", (req, res) => {
  res.status(200).json({
    greeting: "Hello API",
  });
});

app.get("/api/whomi", (req, res) => {
  let ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (ipAddress) {
    ipAddress = ipAddress.split(",")[0].trim();
    ipAddress = ipAddress.replace(/^::ffff:/, ""); // Remove the IPv6 prefix
  }

  const language = req.headers["accept-language"];
  const software = req.headers["user-agent"];

  res.status(200).json({
    ipaddress: ipAddress,
    language: language,
    software: software,
  });
});

app.all("*", (req, res, next) => {
  next("Not Found");
});

//listen for requests :)
const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
  console.log(`Yor app is listen to port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down ...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
