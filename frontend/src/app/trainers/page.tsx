'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Navbar, Footer, Button } from '../../components/common';

interface ITrainer {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  specialization: string[];
  experienceYears: number;
  certifications: string[];
  bio: string;
  profilePictureUrl?: string;
  rating: number;
  availability: {
    dayOfWeek: number;
    slots: string[];
  }[];
}

export default function TrainersPage() {
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');

  const { data: trainers, isLoading } = useQuery({
    queryKey: ['trainers', filterSpecialization],
    queryFn: async () => {
      const res = await api.get('/trainers');
      return res.data?.data as ITrainer[];
    }
  });

  const specializations = [
    { label: 'All Specializations', value: 'all' },
    { label: 'Strength', value: 'strength' },
    { label: 'HIIT', value: 'hiit' },
    { label: 'Yoga', value: 'yoga' },
    { label: 'Pilates', value: 'pilates' },
    { label: 'Cardio', value: 'cardio' }
  ];

  const filteredTrainers = trainers?.filter((trainer) => {
    if (filterSpecialization === 'all') return true;
    return trainer.specialization.some((s) => s.toLowerCase() === filterSpecialization.toLowerCase());
  });

  const getDayName = (dayNum: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum] || `Day ${dayNum}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-charcoal text-brand-ivory overflow-x-hidden">
      <Navbar />

      {/* Header */}
      <section className="relative py-20 px-4 text-center border-b border-brand-beige/10 bg-brand-charcoal-tint/30">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="font-secondary text-xs uppercase tracking-widest text-brand-gold font-medium">
            Meet the Experts
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider">
            ELITE PERSONAL COACHES
          </h1>
          <div className="h-[1px] w-24 bg-brand-gold mx-auto" />
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 space-y-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {specializations.map((spec) => (
            <button
              key={spec.value}
              onClick={() => setFilterSpecialization(spec.value)}
              className={`font-secondary text-xs uppercase tracking-widest px-6 py-2.5 rounded-brand border transition-all duration-250 ${
                filterSpecialization === spec.value
                  ? 'bg-brand-gold text-brand-charcoal border-brand-gold font-semibold'
                  : 'bg-transparent border-brand-beige/25 text-brand-ivory-muted hover:border-brand-gold hover:text-brand-gold'
              }`}
            >
              {spec.label}
            </button>
          ))}
        </div>

        {/* Directory Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[420px] rounded-brand bg-brand-charcoal-tint border border-brand-beige/5 animate-pulse" />
            ))}
          </div>
        ) : filteredTrainers && filteredTrainers.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredTrainers.map((trainer) => (
              <div
                key={trainer._id}
                className="group rounded-brand overflow-hidden border border-brand-beige/10 bg-brand-charcoal-tint transition-all duration-250 hover:border-brand-gold hover:translate-y-[-4px] flex flex-col justify-between"
              >
                <div className="h-[280px] w-full relative overflow-hidden bg-neutral-900">
                  {trainer.profilePictureUrl ? (
                    <Image
                      src={trainer.profilePictureUrl}
                      alt={`Coach ${trainer.userId.firstName} ${trainer.userId.lastName}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-cinzel text-3xl text-brand-gold">
                      {trainer.userId.firstName[0]}{trainer.userId.lastName[0]}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/35 z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal-tint via-transparent to-transparent z-20" />
                </div>
                
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xs uppercase tracking-wider text-brand-gold font-semibold font-secondary">
                        {trainer.experienceYears} Years Exp
                      </span>
                      <span className="text-xs text-brand-teal font-secondary font-semibold">
                        ★ {trainer.rating.toFixed(1)}
                      </span>
                    </div>
                    <h3 className="font-cinzel text-lg font-semibold tracking-wide text-brand-ivory">
                      Coach {trainer.userId.firstName} {trainer.userId.lastName}
                    </h3>
                    
                    <div className="flex flex-wrap gap-1 py-1">
                      {trainer.specialization.map((spec) => (
                        <span key={spec} className="px-2 py-0.5 rounded bg-brand-teal/10 text-brand-teal text-3xs font-semibold font-secondary uppercase tracking-wider">
                          {spec}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-3xs text-brand-ivory-muted font-secondary leading-relaxed line-clamp-3">
                      {trainer.bio}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-brand-beige/10 space-y-3">
                    <div className="text-3xs text-brand-ivory-muted font-secondary">
                      <span className="text-brand-gold font-semibold uppercase">Availability:</span>
                      <div className="mt-1 space-y-0.5">
                        {trainer.availability.map((av) => (
                          <div key={av.dayOfWeek} className="flex justify-between">
                            <span>{getDayName(av.dayOfWeek)}:</span>
                            <span className="text-brand-ivory">{av.slots.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link href="/schedule" className="block w-full">
                      <Button variant="outline" className="w-full text-3xs py-2 uppercase tracking-widest">
                        Book a Session
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center font-secondary text-brand-ivory-muted py-20">
            No personal coaches found matching this specialization.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
