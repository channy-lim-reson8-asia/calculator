const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  role_name: String,
});

module.exports = mongoose.model("Role", roleSchema);
