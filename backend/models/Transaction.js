// backend/models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  itemName: { type: String, required: true },
  status: { type: String, default: "pending" }, // pending | confirmed | failed
  metadata: { type: Object, default: {} },
  date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;