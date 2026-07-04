import { Schema, model, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  rating: number;
  review: string;
  photoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Role/Occupation is required'],
      trim: true,
      default: 'Member'
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 5
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      minlength: [10, 'Review must be at least 10 characters'],
      maxlength: [1000, 'Review cannot exceed 1000 characters']
    },
    photoUrl: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Testimonial = model<ITestimonial>('Testimonial', TestimonialSchema);
