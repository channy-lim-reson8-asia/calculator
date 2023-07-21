const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
  years_of_experience: String,
});

module.exports = mongoose.model("Experience", experienceSchema);
