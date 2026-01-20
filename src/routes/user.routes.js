const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { getUserById, updateUserProfile, getUserStats } = require('../services/user.services');
const { sendSuccess, sendError } = require('../utils/response.utils');

// Get current user's profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, {
      id: user._id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      defaultLanguage: user.defaultLanguage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }, 'Profile retrieved');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

// Get current user's stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await getUserStats(req.user.userId);
    return sendSuccess(res, stats, 'Stats retrieved');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

// Update profile: username, firstname, lastname only
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, firstname, lastname } = req.body || {};
    const updated = await updateUserProfile(req.user.userId, { username, firstname, lastname });
    return sendSuccess(res, {
      id: updated._id,
      username: updated.username,
      email: updated.email,
      firstname: updated.firstname,
      lastname: updated.lastname,
      phone: updated.phone,
      defaultLanguage: updated.defaultLanguage,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }, 'Profile updated');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

module.exports = router;
