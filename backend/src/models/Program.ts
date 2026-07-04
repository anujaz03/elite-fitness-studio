import { Schema, model, Document } from 'mongoose';

export interface IProgram extends Document {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedCaloriesBurned: number;
  durationMinutes: number;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>(
  {
    title: {
      type: String,
      required: [true, 'Program title is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Program title must be at least 3 characters'],
      maxlength: [100, 'Program title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['beginner', 'intermediate', 'advanced']
    },
    estimatedCaloriesBurned: {
      type: Number,
      required: [true, 'Estimated calories burned is required'],
      min: [1, 'Estimated calories burned must be greater than 0']
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [10, 'Duration must be at least 10 minutes']
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required']
    }
  },
  {
    timestamps: true
  }
);

export const Program = model<IProgram>('Program', ProgramSchema);
