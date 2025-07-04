import mongoose from 'mongoose';

// Define the main Post Schema
const PostSchema = new mongoose.Schema({
  // Unique identifier from WordPress, crucial for syncing
  wordpress_post_id: {
    type: Number,
    required: true,
    unique: true,
    index: true, 
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  excerpt: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
    enum: ['publish', 'draft', 'pending', 'private', 'trash', 'future'],
  },
  type: {
    type: String,
     enum: ['post', 'service'],
    default: 'post',
  },
  permalink: {
    type: String,
    required: true,
  },

  categories: {
    type: [String], 
    default: [],
  },

  tags: {
    type: [String], 
    default: [],
  },

  featured_image_url: {
    type: String,
    required: false,
  },
}, {
  timestamps: true
});

// Create the Mongoose Model
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;
