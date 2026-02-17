const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["Income", "Expense"],
    required: true
  }
}, { timestamps: true });

transactionSchema.index({ user: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
