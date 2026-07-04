'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Navbar, Footer, Button } from '../components/common';
import { getProgramImage } from '../utils/formatters';

interface IProgram {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedCaloriesBurned: number;
  durationMinutes: number;
  thumbnailUrl: string;
}

interface ITestimonial {
  _id: string;
  name: string;
  role: string;
  rating: number;
  review: string;
  photoUrl?: string;
}

export default function HomePage() {
  // Fetch programs
  const { data: programsData, isLoading: programsLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const res = await api.get('/programs');
      return res.data?.data as IProgram[];
    }
  });

  // Fetch testimonials
  const { data: testimonialsData } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const res = await api.get('/testimonials');
      return res.data?.data as ITestimonial[];
    }
  });

  // Default fallback programs if server is slow or empty
  const defaultPrograms = [
    {
      title: 'HIIT Blast',
      description: 'High intensity interval training to shock your metabolism.',
      difficulty: 'advanced',
      calories: 600,
      duration: 45
    },
    {
      title: 'Vinyasa Flow',
      description: 'Strengthen stability, structural alignment, and mental focus.',
      difficulty: 'beginner',
      calories: 320,
      duration: 60
    },
    {
      title: 'Core Pilates',
      description: 'Core abdominal target strength, posture control, and spine health.',
      difficulty: 'intermediate',
      calories: 350,
      duration: 50
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-charcoal text-brand-ivory overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero-main.jpg"
            alt="EliteFit Premium Boutique Studio Gym Interior"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#272624_90%)]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-4"
          >
            <span className="font-secondary text-xs uppercase tracking-widest text-brand-gold font-medium">
              LUXURY BOUTIQUE FITNESS STUDIO
            </span>
            <h1 className="font-cinzel text-4xl sm:text-6xl font-bold tracking-wide leading-tight">
              REDEFINE YOUR <br />
              <span className="bg-gradient-to-r from-brand-gold via-brand-beige to-brand-teal bg-clip-text text-transparent">
                PHYSICAL CAPACITY
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base sm:text-lg text-brand-ivory-muted max-w-2xl mx-auto font-secondary leading-relaxed"
          >
            EliteFit Studio combines state-of-the-art strength facilities, professional trainers, and dynamic schedule systems to sculpt the optimal training environment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/schedule" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto text-xs py-4 px-8 tracking-widest uppercase">
                Book a Session
              </Button>
            </Link>
            <Link href="/programs" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto text-xs py-4 px-8 tracking-widest uppercase">
                Explore Programs
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-brand-beige/10 bg-brand-charcoal-tint/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-cinzel text-2xl sm:text-4xl font-bold text-brand-gold">10,000+</div>
              <div className="text-xs uppercase tracking-wider text-brand-ivory-muted font-secondary mt-1">Active Members</div>
            </div>
            <div>
              <div className="font-cinzel text-2xl sm:text-4xl font-bold text-brand-gold">20+</div>
              <div className="text-xs uppercase tracking-wider text-brand-ivory-muted font-secondary mt-1">Elite Coaches</div>
            </div>
            <div>
              <div className="font-cinzel text-2xl sm:text-4xl font-bold text-brand-gold">80+</div>
              <div className="text-xs uppercase tracking-wider text-brand-ivory-muted font-secondary mt-1">Weekly Classes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wider">
            FEATURED TRAINING PROGRAMS
          </h2>
          <div className="h-[1px] w-24 bg-brand-gold mx-auto" />
          <p className="text-sm text-brand-ivory-muted font-secondary max-w-md mx-auto">
            Choose from a selection of tailored classes, calibrated for specific metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programsLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-96 rounded-brand bg-brand-charcoal-tint border border-brand-beige/5 animate-pulse" />
              ))
            : (programsData || []).slice(0, 3).map((program) => (
                <div
                  key={program._id}
                  className="group rounded-brand overflow-hidden border border-brand-beige/10 bg-brand-charcoal-tint transition-all duration-250 hover:border-brand-gold hover:translate-y-[-4px] flex flex-col justify-between"
                >
                  <div className="h-[240px] w-full relative overflow-hidden">
                    <Image
                      src={getProgramImage(program.title)}
                      alt={program.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/45 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal-tint via-transparent to-transparent z-20" />
                  </div>
                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider text-brand-gold font-semibold font-secondary">
                          {program.difficulty}
                        </span>
                        <span className="text-xs text-brand-ivory-muted font-secondary">
                          {program.durationMinutes} Min
                        </span>
                      </div>
                      <h3 className="font-cinzel text-xl font-semibold tracking-wide text-brand-ivory">
                        {program.title}
                      </h3>
                      <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed line-clamp-3">
                        {program.description}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-brand-beige/10 flex items-center justify-between">
                      <span className="text-xs text-brand-teal font-secondary">
                        ~{program.estimatedCaloriesBurned} kcal
                      </span>
                      <Link href="/schedule" className="text-xs text-brand-gold hover:underline font-secondary">
                        Book Class
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          {!programsLoading && (!programsData || programsData.length === 0)
            ? defaultPrograms.map((program) => (
                <div
                  key={program.title}
                  className="rounded-brand border border-brand-beige/10 bg-brand-charcoal-tint p-6 space-y-4 flex flex-col justify-between hover:border-brand-gold"
                >
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider text-brand-gold font-semibold font-secondary">
                      {program.difficulty}
                    </span>
                    <h3 className="font-cinzel text-xl font-semibold tracking-wide">
                      {program.title}
                    </h3>
                    <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-brand-beige/10 flex items-center justify-between">
                    <span className="text-xs text-brand-teal font-secondary">
                      {program.duration} Min | ~{program.calories} kcal
                    </span>
                    <Link href="/schedule" className="text-xs text-brand-gold hover:underline font-secondary">
                      Book Class
                    </Link>
                  </div>
                </div>
              ))
            : null}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-brand-charcoal-tint/30 border-y border-brand-beige/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wider">
              WHY ELITEFIT STUDIO
            </h2>
            <div className="h-[1px] w-24 bg-brand-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-brand bg-brand-charcoal p-8 border border-brand-beige/10 space-y-4 hover:border-brand-gold transition-colors">
              <div className="text-brand-gold h-8 w-8">
                {/* Custom Icon wrapper */}
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-full w-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-cinzel text-lg font-semibold tracking-wide">Luxury Facilities</h3>
              <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed">
                Train inside Hyderabad&apos;s most premium environment, equipped with custom ergonomic layouts, organic bars, and pristine vanity locker suites.
              </p>
            </div>

            <div className="rounded-brand bg-brand-charcoal p-8 border border-brand-beige/10 space-y-4 hover:border-brand-gold transition-colors">
              <div className="text-brand-gold h-8 w-8">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-full w-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-cinzel text-lg font-semibold tracking-wide">Elite Personal Trainers</h3>
              <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed">
                Work closely with certified personal trainers holding specialized certifications to calibrating your posture, strength, and heart rate targets.
              </p>
            </div>

            <div className="rounded-brand bg-brand-charcoal p-8 border border-brand-beige/10 space-y-4 hover:border-brand-gold transition-colors">
              <div className="text-brand-gold h-8 w-8">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-full w-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-cinzel text-lg font-semibold tracking-wide">Flexible Scheduling</h3>
              <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed">
                Access your user dashboard from any mobile or desktop screen to book, cancel, or reschedule fitness classes in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wider">
            MEMBER TESTIMONIALS
          </h2>
          <div className="h-[1px] w-24 bg-brand-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonialsData && testimonialsData.length > 0 ? (
            testimonialsData.slice(0, 2).map((testimonial) => (
              <div key={testimonial._id} className="rounded-brand p-8 border border-brand-beige/10 bg-brand-charcoal-tint space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center font-cinzel text-sm text-brand-gold border border-brand-gold/30">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-secondary text-sm font-semibold">{testimonial.name}</h4>
                    <span className="text-xs text-brand-ivory-muted font-secondary">{testimonial.role}</span>
                  </div>
                </div>
                <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed italic">
                  &ldquo;{testimonial.review}&rdquo;
                </p>
                <div className="text-brand-gold text-xs">
                  {Array.from({ length: testimonial.rating }).map((_, i) => '★').join('')}
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="rounded-brand p-8 border border-brand-beige/10 bg-brand-charcoal-tint space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center font-cinzel text-sm text-brand-gold border border-brand-gold/30">
                    DG
                  </div>
                  <div>
                    <h4 className="font-secondary text-sm font-semibold">David Goggins</h4>
                    <span className="text-xs text-brand-ivory-muted font-secondary">Ultra Runner</span>
                  </div>
                </div>
                <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed italic">
                  &ldquo;The HIIT Blast classes here are absolutely savage. Excellent facilities and world-class trainers.&rdquo;
                </p>
                <div className="text-brand-gold text-xs">★★★★★</div>
              </div>

              <div className="rounded-brand p-8 border border-brand-beige/10 bg-brand-charcoal-tint space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center font-cinzel text-sm text-brand-gold border border-brand-gold/30">
                    EW
                  </div>
                  <div>
                    <h4 className="font-secondary text-sm font-semibold">Emily Watson</h4>
                    <span className="text-xs text-brand-ivory-muted font-secondary">Tech Consultant</span>
                  </div>
                </div>
                <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed italic">
                  &ldquo;EliteFit has completely changed my routine. I can easily book classes around my busy meetings. Vinyasa Yoga with Marcus is amazing.&rdquo;
                </p>
                <div className="text-brand-gold text-xs">★★★★★</div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center relative border-t border-brand-beige/10">
        <div className="absolute inset-0 bg-brand-charcoal-tint/35 z-0" />
        <div className="max-w-2xl mx-auto z-10 relative space-y-6">
          <h2 className="font-cinzel text-3xl font-bold tracking-wider">
            ARE YOU READY TO DISCOVER YOUR POTENTIAL?
          </h2>
          <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed max-w-md mx-auto">
            Book your slot now or join our membership subscription.
          </p>
          <Link href="/register" className="inline-block mt-4">
            <Button variant="primary" className="py-4 px-10 tracking-widest uppercase text-xs">
              Join EliteFit Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
