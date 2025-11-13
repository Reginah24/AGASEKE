const Payment = require('../models/paymentModel')
const Saving = require('../models/savingModel')

// MTN will POST callbacks to this endpoint. Exact payloads vary by product/version.
// We attempt to extract a referenceId and status from common fields.
exports.handleCallback = async (req, res) => {
  try {
    const payload = req.body || {}

    // Try common locations for referenceId and status
    const referenceId = payload.referenceId || payload.ReferenceId || payload.transactionReference || payload.data?.referenceId || payload.data?.ReferenceId || payload.data?.transactionReference
    const status = (payload.status || payload.Status || payload.data?.status || payload.data?.Status || payload.result?.status || payload.result?.Status || '').toString().toLowerCase()

    if (!referenceId) {
      // No reference id — save raw and return
      return res.status(400).json({ error: 'missing referenceId' })
    }

    const payment = await Payment.findOne({ referenceId })
    if (!payment) {
      // Create a record if missing
      const newPayment = new Payment({ referenceId, raw: payload, status: status || 'pending' })
      await newPayment.save()
      return res.json({ message: 'payment record created', referenceId })
    }

    // Map status values to our enum
    let mapped = payment.status
    if (status.includes('success') || status.includes('completed') || status.includes('successful')) mapped = 'successful'
    else if (status.includes('fail') || status.includes('failed') || status.includes('rejected') ) mapped = 'failed'
    else if (status.includes('cancel')) mapped = 'cancelled'
    else mapped = status || payment.status

    payment.status = mapped
    payment.raw = payload
    await payment.save()

    // If successful, update the associated saving (if present)
    if (mapped === 'successful' && payment.savingId) {
      try {
        const saving = await Saving.findById(payment.savingId)
        if (saving) {
          saving.currentAmount = (saving.currentAmount || 0) + Number(payment.amount || 0)
          await saving.save()
        }
      } catch (err) {
        // Log and continue
        console.error('Error updating saving after payment callback', err.message)
      }
    }

    res.json({ message: 'callback processed', referenceId, status: mapped })
  } catch (error) {
    console.error('callback error', error.message)
    res.status(500).json({ error: error.message })
  }
}
