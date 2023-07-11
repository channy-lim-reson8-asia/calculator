const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://channylim:Doraemon@calculator.dsxzntd.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected!"));

app.get("/", (req, res) => {
  res.json({ hi: "channy" });
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
