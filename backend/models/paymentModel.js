const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  referenceId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  savingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Saving' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'EUR' },
  status: { type: String, enum: ['pending','successful','failed','cancelled'], default: 'pending' },
  externalId: { type: String },
  raw: { type: Object },
}, { timestamps: true })

module.exports = mongoose.model('Payment', paymentSchema)
