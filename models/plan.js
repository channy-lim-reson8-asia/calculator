const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const planSchema = new Schema({
  plan_name: { type: String, enum: ["Basic", "Premium"], required: true },
  coworking_desk_price: { type: Number, required: true },
  talent_sourcing_percentage: { type: Number, required: true },
  other_benefits_percentage: { type: Number, required: true },
});

module.exports = mongoose.model("Plan", planSchema);
