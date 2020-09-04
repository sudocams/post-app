const express = require("express");
const path = require("path");
require("./db/mongoose");

const postRoutes = require("./routes/post");
const authRoutes = require("./routes/User");
const app = express();

const bodyparse = require("body-parser");

app.use(bodyparse.json());
// app.use(bodyparse.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use(postRoutes);
app.use(authRoutes);
module.exports = app;
