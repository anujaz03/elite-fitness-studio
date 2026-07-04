import { z } from 'zod';

export const createOrderSchema = z.object({
  planId: z
    .string({ required_error: 'Plan ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Plan ID format'),
  gateway: z.enum(['stripe', 'razorpay'], { required_error: 'Gateway is required' })
});

export const verifyPaymentSchema = z.object({
  transactionId: z.string({ required_error: 'Transaction ID is required' }),
  gateway: z.enum(['stripe', 'razorpay'], { required_error: 'Gateway is required' }),
  signature: z.string().optional()
});
