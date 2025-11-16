const express = require("express");
const router = express.Router();
const postReport = require("../controllers/postReport");
const postSignIn = require("../controllers/userSignIn");

module.exports = function () {
  router.post("/postReport", postReport);
  router.post("/signin", postSignIn);
  return router;
};