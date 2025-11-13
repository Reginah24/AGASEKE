const User = require('../models/userModel')

exports.admin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Not authenticated' })
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) return res.status(500).json({ error: 'ADMIN_EMAIL not configured on server' })
    if (user.email !== adminEmail) return res.status(403).json({ error: 'Admin access required' })

    req.currentUser = user
    next()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
