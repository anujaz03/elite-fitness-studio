import { Schema, model, Document } from 'mongoose';

interface IAvailability {
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  slots: string[]; // ['08:00', '18:00']
}

export interface ITrainer extends Document {
  userId: Schema.Types.ObjectId;
  specialization: ('hiit' | 'yoga' | 'pilates' | 'strength' | 'cardio')[];
  experienceYears: number;
  certifications: string[];
  bio: string;
  profilePictureUrl: string;
  availability: IAvailability[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const TrainerSchema = new Schema<ITrainer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
      index: true
    },
    specialization: {
      type: [String],
      required: [true, 'At least one specialization is required'],
      enum: ['hiit', 'yoga', 'pilates', 'strength', 'cardio']
    },
    experienceYears: {
      type: Number,
      required: [true, 'Experience years is required'],
      min: [0, 'Experience years cannot be negative']
    },
    certifications: {
      type: [String],
      default: []
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    profilePictureUrl: {
      type: String,
      required: [true, 'Profile picture URL is required']
    },
    availability: [
      {
        dayOfWeek: {
          type: Number,
          required: true,
          min: 0,
          max: 6
        },
        slots: {
          type: [String],
          required: true
        }
      }
    ],
    rating: {
      type: Number,
      default: 5.0,
      min: 1.0,
      max: 5.0
    }
  },
  {
    timestamps: true
  }
);

export const Trainer = model<ITrainer>('Trainer', TrainerSchema);
