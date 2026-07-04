import { Schema, model, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: Schema.Types.ObjectId;
  classId: Schema.Types.ObjectId;
  bookingDate: Date;
  status: 'confirmed' | 'pending' | 'cancelled' | 'attended';
  cancellationTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class reference is required'],
      index: true
    },
    bookingDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'cancelled', 'attended'],
      default: 'confirmed'
    },
    cancellationTime: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Prevent double bookings of the same class by the same user
BookingSchema.index({ userId: 1, classId: 1 }, { unique: true });
BookingSchema.index({ classId: 1, status: 1 });

export const Booking = model<IBooking>('Booking', BookingSchema);
