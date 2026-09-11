import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    minlength: 20
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['فناوری', 'برنامه‌نویسی', 'هوش‌مصنوعی', 'وب', 'موبایل', 'ابزار', 'دیگر'],
    required: true
  },
  tags: [String],
  image: String,
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  published: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deletedAt: Date
});

const Post = mongoose.model('Post', postSchema);
export default Post;