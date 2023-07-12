const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
const Dummy = require("./models/dummy.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(
    "mongodb+srv://channylim:Doraemon@calculator.dsxzntd.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected!"));

app.get("/", (req, res) => {
  const datas = Dummy.find();
  res.json({ data: datas });
});
app.post("/", async (req, res) => {
  const newData = new Dummy();
  newData.name = req.body.name;
  await newData.save();
  console.log(newData);
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = app;
