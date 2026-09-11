import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// دریافت پروفایل کاربر
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

// بروز رسانی پروفایل
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { fullName, bio, avatar } = req.body;
    const user = await User.findById(req.user.userId);

    if (fullName) user.fullName = fullName;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    user.updatedAt = Date.now();

    await user.save();

    res.json({
      message: 'پروفایل به‌روز شد',
      user: user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } })
    });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

export default router;