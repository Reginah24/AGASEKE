const express = require('express')
const router = express.Router()
const { getToken, requestToPay } = require('../controllers/mtnController')

router.post('/mtn/token', getToken)
router.post('/mtn/requesttopay', requestToPay)

module.exports = router
