const express = require('express')
const router = express.Router()
const { auth } = require('../middleware/authMiddleware')
const { admin } = require('../middleware/adminMiddleware')
const { createApiUser } = require('../controllers/mtnAdminController')

// Admin-only endpoint to create MTN API user and API key
router.post('/mtn/admin/create-api-user', auth, admin, createApiUser)

module.exports = router
