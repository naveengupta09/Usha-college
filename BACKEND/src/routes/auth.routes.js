import express from 'express';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', authLimiter, (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
});

export default router;
