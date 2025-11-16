const mongoose = require("mongoose");

const postReportDataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  customer: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
  remarks: String,
});

module.exports = mongoose.model("reports", postReportDataSchema);
