import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// دریافت نظرات یک پست
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      post: req.params.postId, 
      approved: true,
      deletedAt: null
    })
      .populate('author', 'username fullName avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

// ایجاد نظر جدید
router.post('/', authenticate, async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    // بررسی وجود پست
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'پست یافت نشد' });
    }

    const newComment = new Comment({
      content,
      author: req.user.userId,
      post: postId,
      parentComment: parentCommentId || null
    });

    await newComment.save();
    await newComment.populate('author', 'username fullName avatar');

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

// تأیید نظر (فقط ادمین)
router.put('/:id/approve', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'فقط ادمین می‌تواند نظرات را تأیید کند' });
    }

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

// حذف نظر
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'نظر یافت نشد' });
    }

    if (comment.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'شما اجازه حذف را ندارید' });
    }

    comment.deletedAt = Date.now();
    await comment.save();

    res.json({ message: 'نظر حذف شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

export default router;