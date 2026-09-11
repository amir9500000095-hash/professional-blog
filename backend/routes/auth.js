import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// ثبت نام
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // بررسی وجود کاربر
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'این کاربر قبلاً ثبت شده است' });
    }

    // ایجاد کاربر جدید
    const user = new User({ username, email, password, fullName });
    await user.save();

    // ایجاد توکن
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'ثبت نام موفق',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

// ورود
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'ایمیل یا رمز عبور نادرست' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'ایمیل یا رمز عبور نادرست' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'ورود موفق',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

export default router;