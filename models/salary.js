const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salarySchema = new Schema({
  role_id: {
    type: mongoose.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  experience_id: {
    type: mongoose.Types.ObjectId,
    ref: "Experience",
    required: true,
  },
  batam_salary: { type: [Number], required: true },
  sg_salary: { type: [Number], required: true },
});

module.exports = mongoose.model("Salary", salarySchema);
