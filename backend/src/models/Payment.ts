import { Schema, model, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  gateway: 'stripe' | 'razorpay';
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  invoiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0.01, 'Payment amount must be greater than 0']
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
      maxlength: [3, 'Currency code must be 3 characters']
    },
    gateway: {
      type: String,
      required: [true, 'Payment gateway provider is required'],
      enum: ['stripe', 'razorpay']
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction reference is required'],
      unique: true,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    invoiceUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

PaymentSchema.index({ userId: 1, createdAt: -1 });

export const Payment = model<IPayment>('Payment', PaymentSchema);
