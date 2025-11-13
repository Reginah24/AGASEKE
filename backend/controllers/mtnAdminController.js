const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

const BASE_URL = process.env.MTN_BASE_URL || 'https://sandbox.momodeveloper.mtn.com'
const SUBSCRIPTION_KEY = process.env.MTN_SUBSCRIPTION_KEY || ''

exports.createApiUser = async (req, res) => {
  try {
    const { callbackHost, apiUserId } = req.body
    if (!callbackHost) return res.status(400).json({ error: 'callbackHost is required (public HTTPS URL)' })
    if (!SUBSCRIPTION_KEY) return res.status(500).json({ error: 'MTN_SUBSCRIPTION_KEY not configured' })

    const userId = apiUserId || uuidv4()

    // Register API user
    const urlCreate = `${BASE_URL}/collection/v1_0/apiuser`
    const headersCreate = {
      'X-Reference-Id': userId,
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      'Content-Type': 'application/json'
    }
    const body = { providerCallbackHost: callbackHost }

    await axios.post(urlCreate, body, { headers: headersCreate })

    // Generate API key
    const urlKey = `${BASE_URL}/collection/v1_0/apiuser/${userId}/apikey`
    const resp = await axios.post(urlKey, null, { headers: { 'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY } })

    // resp should contain an `apiKey` field
    const apiKey = resp.data && resp.data.apiKey ? resp.data.apiKey : undefined
    if (!apiKey) return res.status(500).json({ error: 'API key generation did not return apiKey', raw: resp.data })

    res.json({ apiUserId: userId, apiKey })
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status || 500).json({ error: err.response.data || err.message })
    }
    res.status(500).json({ error: err.message })
  }
}
