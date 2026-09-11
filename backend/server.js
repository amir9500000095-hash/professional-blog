import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

// Middleware امنیتی
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Middleware محدودیت نرخ
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Middleware تجزیه
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// اتصال به MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/professional-blog')
  .then(() => console.log('MongoDB متصل شد'))
  .catch(err => console.error('خطای MongoDB:', err));

// مسیرهای API
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// مسیر سلامتی
app.get('/health', (req, res) => {
  res.json({ status: 'سرور در حال اجرا است' });
});

// Middleware خطا
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'خطای سرور داخلی',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`سرور در پورت ${PORT} در حال اجرا است`);
});

export default app;