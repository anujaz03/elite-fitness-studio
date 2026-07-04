import { Schema, model, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address']
    },
    phone: {
      type: String
    },
    message: {
      type: String,
      required: [true, 'Message body is required'],
      minlength: [5, 'Message must be at least 5 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'archived'],
      default: 'unread'
    }
  },
  {
    timestamps: true
  }
);

ContactMessageSchema.index({ status: 1 });

export const ContactMessage = model<IContactMessage>('ContactMessage', ContactMessageSchema);
