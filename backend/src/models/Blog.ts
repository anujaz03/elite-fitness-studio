import { Schema, model, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  author: string; // Admin name or user ref
  category: string;
  content: string;
  thumbnailUrl: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      minlength: [5, 'Blog title must be at least 5 characters']
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      default: 'EliteFit Team'
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required']
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

BlogSchema.index({ category: 1 });

export const Blog = model<IBlog>('Blog', BlogSchema);
