const Saving = require('../models/savingModel')
const mtnService = require('../services/mtnService')
const Payment = require('../models/paymentModel')

exports.createSaving = async (req, res) => {
  // #swagger.tags = ['Saving']
  try {
    const { goalName, targetAmount, lockUntil } = req.body
    const saving = new Saving({
      userId: req.user.id,
      goalName,
      targetAmount,
      lockUntil
    })
    //check if user already has a saving goal
    const existingSaving = await Saving.findOne({ userId: req.user.id })
    if (existingSaving)
      return res.status(400).json({ error: 'Saving goal already exists' })
    await saving.save()
    res.status(201).json(saving)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.addFunds = async (req, res) => {
  // #swagger.tags = ['Saving']
  // This endpoint now initiates an MTN Request-to-Pay.
  // Note: Request-to-Pay is asynchronous. We send the payment request and return a referenceId.
  // Actual fund update should occur when MTN calls your webhook/callback confirming payment.
  try {
    const { amount, payer, currency, externalId } = req.body
    if (!amount) return res.status(400).json({ error: 'amount is required' })
    if (!payer) return res.status(400).json({ error: 'payer (MSISDN) is required' })

    // Initiate Request-to-Pay via MTN
    const resp = await mtnService.requestToPay({ amount, payer, currency, externalId })

    // Create a Payment record to track this request
    const payment = new Payment({
      referenceId: resp.referenceId,
      userId: req.user.id,
      savingId: saving ? saving._id : undefined,
      amount: Number(amount),
      currency: currency || 'EUR',
      status: 'pending',
      externalId: externalId || undefined,
      raw: resp.data || {}
    })
    await payment.save()

    // MTN typically returns 202 Accepted for async requests. We forward the referenceId so client can track.
    return res.status(202).json({ message: 'Payment request initiated', referenceId: resp.referenceId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
//get user savings
exports.getUserSavings = async (req, res) => {
    // #swagger.tags = ['Saving']
  try {
    const savings = await Saving.find({ userId: req.user.id });
    res.json(savings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getSavingById = async (req, res) => {
    // #swagger.tags = ['Saving']
  try {
    const saving = await Saving.findOne({ _id: req.params.id, userId: req.user.id });
    if (!saving) return res.status(404).json({ error: "Saving not found" });
    res.json(saving);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

