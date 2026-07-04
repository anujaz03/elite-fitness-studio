import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elitefit';
    console.log('[Database]: Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI);
    
    console.log('[Database]: MongoDB connected successfully.');
  } catch (error) {
    console.error('[Database]: MongoDB connection error: ', error);
    process.exit(1);
  }
};
