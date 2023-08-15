const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addsOnSchema = new Schema({
  addson_name: { type: String, required: true },
  addson_price: { type: Number, required: true },
});

module.exports = mongoose.model("AddsOn", addsOnSchema);
