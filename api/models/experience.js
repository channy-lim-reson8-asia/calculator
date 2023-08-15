const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
  years_of_experience: { type: String, required: true },
});

module.exports = mongoose.model("Experience", experienceSchema);
