const express = require('express')
const router = express.Router()
const { handleCallback } = require('../controllers/mtnWebhookController')

// MTN will POST callbacks here. Typically this is a public endpoint.
router.post('/mtn/callback', express.json(), handleCallback)

module.exports = router
