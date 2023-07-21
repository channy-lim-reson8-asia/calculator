const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
const Role = require("./models/role.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(
    "mongodb+srv://channylim:Doraemon@calculator.dsxzntd.mongodb.net/cost-overview?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected!"));

app.get("/roles", async (req, res) => {
  const roles = await Role.find();
  res.send(roles);
});
app.post("/roles", async (req, res) => {
  const newData = new Role();
  newData.role_name = req.body.role_name;
  await newData.save();
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = app;
