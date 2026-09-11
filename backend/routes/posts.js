import express from 'express';
import Post from '../models/Post.js';
import { authenticate } from '../middleware/auth.js';
import slug from 'slug';

const router = express.Router();

// دریافت تمام پست‌های منتشر شده
router.get('/', async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10 } = req.query;
    const query = { published: true, deletedAt: null };

    if (category) query.category = category;
    if (tag) query.tags = tag;

    const posts = await Post.find(query)
      .populate('author', 'username fullName avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

// دریافت یک پست
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, deletedAt: null })
      .populate('author', 'username fullName avatar bio');

    if (!post) {
      return res.status(404).json({ message: 'پست یافت نشد' });
    }

    // افزایش تعداد بازدید
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

// ایجاد پست جدید
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, content, category, tags, image } = req.body;

    const newPost = new Post({
      title,
      slug: slug(title).toLowerCase(),
      description,
      content,
      category,
      tags: tags || [],
      image,
      author: req.user.userId
    });

    await newPost.save();
    await newPost.populate('author', 'username fullName avatar');

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

// ویرایش پست
router.put('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'پست یافت نشد' });
    }

    if (post.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'شما اجازه ویرایش را ندارید' });
    }

    Object.assign(post, req.body);
    post.updatedAt = Date.now();
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

// حذف پست
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'پست یافت نشد' });
    }

    if (post.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'شما اجازه حذف را ندارید' });
    }

    post.deletedAt = Date.now();
    await post.save();

    res.json({ message: 'پست حذف شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
});

export default router;