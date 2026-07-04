import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone: string;
  address?: string;
  profileImage?: string;
  role: 'guest' | 'member' | 'trainer' | 'admin' | 'super-admin';
  status: 'active' | 'inactive' | 'suspended';
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    address: {
      type: String
    },
    profileImage: {
      type: String
    },
    role: {
      type: String,
      enum: ['guest', 'member', 'trainer', 'admin', 'super-admin'],
      default: 'member'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes
UserSchema.index({ verificationToken: 1 }, { sparse: true });

export const User = model<IUser>('User', UserSchema);
