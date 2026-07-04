import { z } from 'zod';

export const createBookingSchema = z.object({
  classId: z
    .string({ required_error: 'Class ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Class ID format')
});
