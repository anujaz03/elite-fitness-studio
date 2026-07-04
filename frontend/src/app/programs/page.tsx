'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Navbar, Footer, Button } from '../../components/common';
import { getProgramImage } from '../../utils/formatters';

interface IProgram {
  _id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedCaloriesBurned: number;
  durationMinutes: number;
  thumbnailUrl: string;
}

export default function ProgramsPage() {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const { data: programs, isLoading } = useQuery({
    queryKey: ['programs', filterDifficulty],
    queryFn: async () => {
      const url = filterDifficulty === 'all' ? '/programs' : `/programs?difficulty=${filterDifficulty}`;
      const res = await api.get(url);
      return res.data?.data as IProgram[];
    }
  });

  const difficultyToggles = [
    { label: 'All Programs', value: 'all' },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-charcoal text-brand-ivory overflow-x-hidden">
      <Navbar />

      {/* Header */}
      <section className="relative py-20 px-4 text-center border-b border-brand-beige/10 bg-brand-charcoal-tint/30">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="font-secondary text-xs uppercase tracking-widest text-brand-gold font-medium">
            Explore Training Tiers
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider">
            FITNESS PROGRAMS
          </h1>
          <div className="h-[1px] w-24 bg-brand-gold mx-auto" />
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 space-y-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {difficultyToggles.map((toggle) => (
            <button
              key={toggle.value}
              onClick={() => setFilterDifficulty(toggle.value)}
              className={`font-secondary text-xs uppercase tracking-widest px-6 py-2.5 rounded-brand border transition-all duration-250 ${
                filterDifficulty === toggle.value
                  ? 'bg-brand-gold text-brand-charcoal border-brand-gold font-semibold'
                  : 'bg-transparent border-brand-beige/25 text-brand-ivory-muted hover:border-brand-gold hover:text-brand-gold'
              }`}
            >
              {toggle.label}
            </button>
          ))}
        </div>

        {/* Directory Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 rounded-brand bg-brand-charcoal-tint border border-brand-beige/5 animate-pulse" />
            ))}
          </div>
        ) : programs && programs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {programs.map((program) => (
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
                    <span className="text-xs text-brand-teal font-secondary font-medium">
                      ~{program.estimatedCaloriesBurned} kcal
                    </span>
                    <Link href="/schedule">
                      <Button variant="outline" className="text-xs py-2 px-4 rounded-brand">
                        VIEW TIMETABLE
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center font-secondary text-brand-ivory-muted py-20">
            No training programs matching the selected filter were found.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
