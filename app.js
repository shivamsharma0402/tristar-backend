const { MongoClient } = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
let app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const connectDB = require("./db");
const Reports = require("./models/PostReportData");
const Users = require("./models/UserData");
const routes = require("./routes/routes");
app.use('/output', express.static(path.join(__dirname, 'output')));
rootpath = path.resolve(__dirname);

app.get('/getFile', (req, res) => {
  const file = req.query.file;
  const filePath = path.join(__dirname, 'output', 'tmp', file); // adjust folder

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).send("File not found");
    }
  });
});

app.use(routes());

app.listen(3000, async () => {
  await connectDB();
  console.log("🚀 Server running on http://localhost:3000");
});
