const mongoose = require("mongoose");

const CreationSchema = new mongoose.Schema({
  user: String,
  type: String,
  prompt: String,
  content: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Creation", CreationSchema);