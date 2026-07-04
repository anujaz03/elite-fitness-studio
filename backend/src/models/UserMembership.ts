import { Schema, model, Document } from 'mongoose';

export interface IUserMembership extends Document {
  userId: Schema.Types.ObjectId;
  planId: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  gatewaySubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserMembershipSchema = new Schema<IUserMembership>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      index: true
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      required: [true, 'Membership Plan reference is required']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active'
    },
    gatewaySubscriptionId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

UserMembershipSchema.index({ userId: 1, status: 1 });

export const UserMembership = model<IUserMembership>('UserMembership', UserMembershipSchema);
