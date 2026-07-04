import { Schema, model, Document } from 'mongoose';

export interface IMembershipPlan extends Document {
  planName: 'monthly' | 'quarterly' | 'annual';
  durationMonths: number;
  price: number;
  discountPercentage: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipPlanSchema = new Schema<IMembershipPlan>(
  {
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
      unique: true,
      enum: ['monthly', 'quarterly', 'annual']
    },
    durationMonths: {
      type: Number,
      required: [true, 'Duration in months is required'],
      min: [1, 'Duration must be at least 1 month']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    features: {
      type: [String],
      required: true,
      default: []
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

export const MembershipPlan = model<IMembershipPlan>('MembershipPlan', MembershipPlanSchema);
