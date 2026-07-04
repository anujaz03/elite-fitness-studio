import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Load env from backend folder
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import {
  User,
  MembershipPlan,
  Trainer,
  Program,
  Class,
  Testimonial,
  Blog
} from '../models';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elitefit';

async function seedDatabase() {
  try {
    console.log('[Seeder]: Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seeder]: Database connected successfully.');

    // 1. Clear Existing Data
    console.log('[Seeder]: Cleaning existing database collections...');
    await User.deleteMany({});
    await MembershipPlan.deleteMany({});
    await Trainer.deleteMany({});
    await Program.deleteMany({});
    await Class.deleteMany({});
    await Testimonial.deleteMany({});
    await Blog.deleteMany({});
    console.log('[Seeder]: Database collections cleared.');

    // 2. Hash Password Helper
    const saltRounds = 10;
    const adminPasswordHash = await bcrypt.hash('AdminSecret123!', saltRounds);
    const trainerPasswordHash = await bcrypt.hash('TrainerSecret123!', saltRounds);
    const memberPasswordHash = await bcrypt.hash('MemberSecret123!', saltRounds);

    // 3. Seed Users
    console.log('[Seeder]: Inserting default users...');
    const users = await User.insertMany([
      {
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@elitefit.com',
        passwordHash: adminPasswordHash,
        phone: '+919876543210',
        role: 'super-admin',
        status: 'active',
        isEmailVerified: true
      },
      {
        firstName: 'Sarah',
        lastName: 'Connor',
        email: 'sarah.connor@elitefit.com',
        passwordHash: trainerPasswordHash,
        phone: '+919876543211',
        role: 'trainer',
        status: 'active',
        isEmailVerified: true
      },
      {
        firstName: 'Marcus',
        lastName: 'Aurelius',
        email: 'marcus.aurelius@elitefit.com',
        passwordHash: trainerPasswordHash,
        phone: '+919876543212',
        role: 'trainer',
        status: 'active',
        isEmailVerified: true
      },
      {
        firstName: 'Elena',
        lastName: 'Rostova',
        email: 'elena.rostova@elitefit.com',
        passwordHash: trainerPasswordHash,
        phone: '+919876543214',
        role: 'trainer',
        status: 'active',
        isEmailVerified: true
      },
      {
        firstName: 'Bruce',
        lastName: 'Wayne',
        email: 'bruce.wayne@elitefit.com',
        passwordHash: trainerPasswordHash,
        phone: '+919876543215',
        role: 'trainer',
        status: 'active',
        isEmailVerified: true
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@elitefit.com',
        passwordHash: memberPasswordHash,
        phone: '+919876543213',
        role: 'member',
        status: 'active',
        isEmailVerified: true
      }
    ]);
    console.log(`[Seeder]: Created ${users.length} user records.`);

    const trainerUser1 = users[1];
    const trainerUser2 = users[2];
    const trainerUser3 = users[3];
    const trainerUser4 = users[4];

    // 4. Seed Membership Plans
    console.log('[Seeder]: Inserting membership plans...');
    const plans = await MembershipPlan.insertMany([
      {
        planName: 'monthly',
        durationMonths: 1,
        price: 2999,
        discountPercentage: 0,
        features: [
          'Access to gym floor facilities',
          'Unlimited group fitness classes',
          '1 Complimentary trainer consultation',
          'Locker & shower facilities'
        ],
        isActive: true
      },
      {
        planName: 'quarterly',
        durationMonths: 3,
        price: 7999,
        discountPercentage: 10,
        features: [
          'Access to gym floor facilities',
          'Unlimited group fitness classes',
          '3 Complimentary trainer consultations',
          'Locker & shower facilities',
          '1 Guest pass per month'
        ],
        isActive: true
      },
      {
        planName: 'annual',
        durationMonths: 12,
        price: 24999,
        discountPercentage: 30,
        features: [
          'Access to gym floor facilities',
          'Unlimited group fitness classes',
          '12 Personal training evaluation sessions',
          'Locker & shower facilities',
          'Unlimited guest passes (1 at a time)',
          '10% off organic juice bar items'
        ],
        isActive: true
      }
    ]);
    console.log(`[Seeder]: Created ${plans.length} membership plan records.`);

    // 5. Seed Trainers details
    console.log('[Seeder]: Inserting trainers catalog profile details...');
    const trainers = await Trainer.insertMany([
      {
        userId: trainerUser1._id,
        specialization: ['hiit', 'strength', 'cardio'],
        experienceYears: 6,
        certifications: ['ACE Certified Personal Trainer', 'HIIT Specialist Certificate'],
        bio: 'Sarah is an energetic trainer who specializes in burning fat and building functional full-body power.',
        profilePictureUrl: '/images/trainers/trainer-sarah.jpg',
        availability: [
          { dayOfWeek: 1, slots: ['07:00', '09:00', '18:00'] }, // Monday
          { dayOfWeek: 3, slots: ['07:00', '09:00', '18:00'] }, // Wednesday
          { dayOfWeek: 5, slots: ['07:00', '09:00', '18:00'] }  // Friday
        ],
        rating: 4.9
      },
      {
        userId: trainerUser2._id,
        specialization: ['yoga', 'pilates'],
        experienceYears: 8,
        certifications: ['RYT 500 Certified Yoga Teacher', 'Stott Pilates Certificate'],
        bio: 'Marcus focuses on alignment, mobility, stress reduction, and building deep structural core stability.',
        profilePictureUrl: '/images/trainers/trainer-marcus.jpg',
        availability: [
          { dayOfWeek: 2, slots: ['08:00', '10:00', '17:00'] }, // Tuesday
          { dayOfWeek: 4, slots: ['08:00', '10:00', '17:00'] }, // Thursday
          { dayOfWeek: 6, slots: ['09:00', '11:00'] }           // Saturday
        ],
        rating: 4.8
      },
      {
        userId: trainerUser3._id,
        specialization: ['yoga', 'pilates'],
        experienceYears: 5,
        certifications: ['ACE Certified Group Fitness Instructor', 'Yin Yoga 200hr Teacher'],
        bio: 'Elena helps members develop flexibility, mindfulness, and lean muscle tone through mindful movement.',
        profilePictureUrl: '/images/trainers/trainer-elena.jpg',
        availability: [
          { dayOfWeek: 1, slots: ['08:00', '10:00'] },
          { dayOfWeek: 3, slots: ['08:00', '10:00'] }
        ],
        rating: 4.7
      },
      {
        userId: trainerUser4._id,
        specialization: ['strength', 'hiit'],
        experienceYears: 10,
        certifications: ['NSCA Certified Strength & Conditioning Specialist (CSCS)', 'USA Weightlifting Coach'],
        bio: 'Bruce specializes in maximum power output, barbell mechanics, and high-performance metabolic conditioning.',
        profilePictureUrl: '/images/trainers/trainer-bruce.jpg',
        availability: [
          { dayOfWeek: 2, slots: ['06:00', '08:00', '18:00'] },
          { dayOfWeek: 4, slots: ['06:00', '08:00', '18:00'] }
        ],
        rating: 5.0
      }
    ]);
    console.log(`[Seeder]: Created ${trainers.length} trainer catalog profiles.`);

    const trainer1 = trainers[0];
    const trainer2 = trainers[1];
    const trainer3 = trainers[2];
    const trainer4 = trainers[3];

    // 6. Seed Programs
    console.log('[Seeder]: Inserting fitness programs directory...');
    const programs = await Program.insertMany([
      {
        title: 'HIIT Blast',
        description: 'Short intervals of high-intensity functional cardio combined with quick active recoveries.',
        difficulty: 'advanced',
        estimatedCaloriesBurned: 650,
        durationMinutes: 45,
        thumbnailUrl: 'https://res.cloudinary.com/elitefit/programs/hiit.jpg'
      },
      {
        title: 'Vinyasa Flow',
        description: 'Synchronized movement and breath sequences designed to improve stability, strength, and inner focus.',
        difficulty: 'beginner',
        estimatedCaloriesBurned: 320,
        durationMinutes: 60,
        thumbnailUrl: 'https://res.cloudinary.com/elitefit/programs/yoga.jpg'
      },
      {
        title: 'Core Pilates',
        description: 'Precise floor-work exercises targeting core abdominal muscle groups, spine alignment, and posture.',
        difficulty: 'intermediate',
        estimatedCaloriesBurned: 350,
        durationMinutes: 50,
        thumbnailUrl: 'https://res.cloudinary.com/elitefit/programs/pilates.jpg'
      },
      {
        title: 'Power Strength',
        description: 'Weight training and compound lifts tailored to stimulate hypertrophy and muscle density.',
        difficulty: 'advanced',
        estimatedCaloriesBurned: 500,
        durationMinutes: 55,
        thumbnailUrl: 'https://res.cloudinary.com/elitefit/programs/strength.jpg'
      }
    ]);
    console.log(`[Seeder]: Created ${programs.length} program records.`);

    const programHIIT = programs[0];
    const programYoga = programs[1];
    const programPilates = programs[2];

    // 7. Seed scheduled classes
    console.log('[Seeder]: Scheduling class calendar occurrences...');
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(today.getDate() + 2);

    const classesList = await Class.insertMany([
      {
        programId: programHIIT._id,
        trainerId: trainer1._id,
        date: today,
        timeSlot: '07:00',
        capacity: 15,
        slotsOccupied: 4,
        status: 'scheduled'
      },
      {
        programId: programYoga._id,
        trainerId: trainer2._id,
        date: today,
        timeSlot: '08:00',
        capacity: 20,
        slotsOccupied: 8,
        status: 'scheduled'
      },
      {
        programId: programPilates._id,
        trainerId: trainer3._id,
        date: tomorrow,
        timeSlot: '10:00',
        capacity: 15,
        slotsOccupied: 0,
        status: 'scheduled'
      },
      {
        programId: programHIIT._id,
        trainerId: trainer4._id,
        date: dayAfter,
        timeSlot: '18:00',
        capacity: 15,
        slotsOccupied: 0,
        status: 'scheduled'
      }
    ]);
    console.log(`[Seeder]: Created ${classesList.length} scheduled class calendar occurrences.`);

    // 8. Seed Testimonials
    console.log('[Seeder]: Inserting testimonials...');
    await Testimonial.insertMany([
      {
        name: 'David Goggins',
        role: 'Ultra Runner',
        rating: 5,
        review: 'The HIIT Blast classes here are absolutely savage. Excellent facilities and world-class trainers.',
        photoUrl: 'https://res.cloudinary.com/elitefit/reviews/david.jpg',
        isActive: true
      },
      {
        name: 'Emily Watson',
        role: 'Tech Consultant',
        rating: 5,
        review: 'EliteFit has completely changed my routine. I can easily book classes around my busy meetings. Vinyasa Yoga with Marcus is amazing.',
        photoUrl: 'https://res.cloudinary.com/elitefit/reviews/emily.jpg',
        isActive: true
      }
    ]);

    // 9. Seed Blog Articles
    console.log('[Seeder]: Inserting blog articles...');
    await Blog.insertMany([
      {
        title: '5 Warm-up Routines for Injury Prevention',
        slug: '5-warmup-routines-for-injury-prevention',
        author: 'EliteFit Team',
        category: 'Training',
        content: 'Proper dynamic stretching before lifts ensures your synovial fluid is warm, lubricates joint cavities, and minimizes soft tissue strain...',
        thumbnailUrl: '/images/blog/stretching-blog.jpg',
        isPublished: true,
        publishedAt: today
      },
      {
        title: 'Understanding Macros: A Beginners Diet Guide',
        slug: 'understanding-macros-beginners-diet-guide',
        author: 'EliteFit Team',
        category: 'Nutrition',
        content: 'Balancing your daily caloric intake between protein, carbohydrates, and healthy fats is the cornerstone of metabolic optimization...',
        thumbnailUrl: '/images/blog/nutrition-blog.jpg',
        isPublished: true,
        publishedAt: today
      }
    ]);

    console.log('[Seeder]: Seeding execution complete!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder]: Error during database seeding: ', error);
    process.exit(1);
  }
}

seedDatabase();
