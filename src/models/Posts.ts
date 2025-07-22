import mongoose from 'mongoose';
interface IPost {
  title: string;
  slug: string;
  description: string;
  excerp: string;
  thumnail: {
    width?: number;
    height?: number;
    url?: string;
  };
  tags: string[];
  postType: 'service' | 'blog';
  category: { _id: mongoose.Types.ObjectId; name: string };
  content: string;
}

const PostSchema = new mongoose.Schema<IPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },

  excerp: { type: String, required: true },
  thumnail: {
    width: { type: Number },
    height: { type: Number },
    url: { type: String },
  },
  tags: { type: [String], default: [] },
  postType: { type: String, enum: ['service', 'blog'], required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    default: new mongoose.Types.ObjectId('687e0480f869c4910bb64f7f'),
  },
  content: { type: String, required: true },
}, {
  timestamps: true,
});

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
