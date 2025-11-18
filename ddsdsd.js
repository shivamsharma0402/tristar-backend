let convertToPdf = require("docx-pdf");
console.log("Converting DOCX to PDF...", convertToPdf);

convertToPdf("templates/field_service_report_template.docx", "templates/output.pdf", (err) => {
  if (err) console.log(err);
  console.log("PDF ready");
});