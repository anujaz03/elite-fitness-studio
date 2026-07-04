import { Request, Response } from 'express';
import { Testimonial } from '../models/Testimonial';
import { Blog } from '../models/Blog';
import { ContactMessage } from '../models/ContactMessage';
import { contactSchema, createBlogSchema } from '../validators/cmsValidators';

export const getTestimonials = async (_req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await Testimonial.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'TESTIMONIALS_FETCH_FAILED',
        message: 'An error occurred fetching testimonials.'
      }
    });
  }
};

export const getBlogs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 });
    res.status(200).json({
      success: true,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'BLOGS_FETCH_FAILED',
        message: 'An error occurred fetching blog articles.'
      }
    });
  }
};

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Contact form details invalid',
          details: parsed.error.issues.map((i) => ({ field: i.path[0], message: i.message }))
        }
      });
      return;
    }

    const { name, email, phone, message } = parsed.data;

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      message,
      status: 'unread'
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been submitted. A team representative will contact you shortly.',
      data: {
        messageId: newMessage._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CONTACT_SUBMIT_FAILED',
        message: 'An error occurred submitting your message.'
      }
    });
  }
};

export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createBlogSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Blog details invalid',
          details: parsed.error.issues.map((i) => ({ field: i.path[0], message: i.message }))
        }
      });
      return;
    }

    const { title, slug, author, category, content, thumbnailUrl } = parsed.data;

    const newBlog = await Blog.create({
      title,
      slug,
      author,
      category,
      content,
      thumbnailUrl: thumbnailUrl || 'https://res.cloudinary.com/elitefit/blogs/default.jpg',
      isPublished: true,
      publishedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Blog article created and published successfully.',
      data: newBlog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'BLOG_CREATION_FAILED',
        message: 'An error occurred creating the blog article.'
      }
    });
  }
};
