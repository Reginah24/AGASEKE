const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

const BASE_URL = process.env.MTN_BASE_URL || 'https://sandbox.momodeveloper.mtn.com'
const SUBSCRIPTION_KEY = process.env.MTN_SUBSCRIPTION_KEY || ''
const API_USER = process.env.MTN_API_USER || ''
const API_KEY = process.env.MTN_API_KEY || ''
const TARGET_ENV = process.env.MTN_TARGET_ENVIRONMENT || 'sandbox'

async function getAccessToken() {
  if (!API_USER || !API_KEY || !SUBSCRIPTION_KEY) {
    throw new Error('Missing MTN credentials (MTN_API_USER, MTN_API_KEY, MTN_SUBSCRIPTION_KEY)')
  }

  const basic = Buffer.from(`${API_USER}:${API_KEY}`).toString('base64')
  const url = `${BASE_URL}/collection/token/`

  const headers = {
    'Authorization': `Basic ${basic}`,
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
  }

  const resp = await axios.post(url, null, { headers })
  if (resp && resp.data && resp.data.access_token) return resp.data.access_token
  if (resp && resp.data && resp.data.token) return resp.data.token
  throw new Error('Unable to obtain access token from MTN')
}

async function requestToPay({ amount, currency = 'EUR', externalId = '001', payer }) {
  if (!amount || !payer) throw new Error('Missing amount or payer')
  const token = await getAccessToken()
  const referenceId = uuidv4()
  const url = `${BASE_URL}/collection/v1_0/requesttopay`

  const headers = {
    'X-Reference-Id': referenceId,
    'X-Target-Environment': TARGET_ENV,
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  const body = {
    amount: String(amount),
    currency,
    externalId,
    payer: {
      partyIdType: 'MSISDN',
      partyId: payer
    },
    payerMessage: 'Payment request',
    payeeNote: 'AGASEKE collection'
  }

  const resp = await axios.post(url, body, { headers })
  return { referenceId, statusCode: resp.status, data: resp.data }
}

module.exports = {
  getAccessToken,
  requestToPay
}
