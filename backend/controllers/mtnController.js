const mtnService = require('../services/mtnService')

exports.getToken = async (req, res) => {
  try {
    const token = await mtnService.getAccessToken()
    res.json({ token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.requestToPay = async (req, res) => {
  try {
    const { amount, payer, currency, externalId } = req.body
    const resp = await mtnService.requestToPay({ amount, payer, currency, externalId })
    res.status(202).json(resp)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
