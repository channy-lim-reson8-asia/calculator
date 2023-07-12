const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dummySchema = new Schema({
  name: String,
});

module.exports = mongoose.model("Data", dummySchema);
