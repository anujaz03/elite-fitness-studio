import { Schema, model, Document } from 'mongoose';

export interface IClass extends Document {
  programId: Schema.Types.ObjectId;
  trainerId: Schema.Types.ObjectId;
  date: Date;
  timeSlot: string;
  capacity: number;
  slotsOccupied: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: [true, 'Program reference is required'],
      index: true
    },
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: 'Trainer',
      required: [true, 'Trainer reference is required'],
      index: true
    },
    date: {
      type: Date,
      required: [true, 'Class date is required'],
      index: true
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Time slot must be in HH:MM format']
    },
    capacity: {
      type: Number,
      required: [true, 'Class capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    slotsOccupied: {
      type: Number,
      default: 0,
      min: [0, 'Slots occupied cannot be negative']
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  },
  {
    timestamps: true
  }
);

ClassSchema.index({ date: 1, status: 1 });

export const Class = model<IClass>('Class', ClassSchema);
