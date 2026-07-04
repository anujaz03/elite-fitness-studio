import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  phone: z.string().optional(),
  message: z
    .string({ required_error: 'Message is required' })
    .min(5, 'Message must be at least 5 characters')
    .trim()
});

export const createBlogSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(5, 'Title must be at least 5 characters')
    .trim(),
  slug: z
    .string({ required_error: 'Slug is required' })
    .trim()
    .toLowerCase(),
  author: z
    .string({ required_error: 'Author is required' })
    .trim(),
  category: z
    .string({ required_error: 'Category is required' })
    .trim(),
  content: z
    .string({ required_error: 'Content is required' })
    .min(10, 'Content must be at least 10 characters')
    .trim(),
  thumbnailUrl: z.string().optional()
});
