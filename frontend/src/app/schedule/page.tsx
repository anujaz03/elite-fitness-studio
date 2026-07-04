'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Footer, Button } from '../../components/common';

interface IClass {
  _id: string;
  programId: {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
    estimatedCaloriesBurned: number;
    durationMinutes: number;
  };
  trainerId: {
    _id: string;
    userId: {
      firstName: string;
      lastName: string;
    };
  };
  date: string;
  timeSlot: string;
  capacity: number;
  slotsOccupied: number;
  status: string;
}

export default function SchedulePage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate 7 days buttons starting from today
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  function startOfDay(d: Date) {
    const res = new Date(d);
    res.setHours(0, 0, 0, 0);
    return res;
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };

  const getDayNumber = (date: Date) => {
    return date.getDate();
  };

  const formatDateParam = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch classes matching selectedDate
  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes', selectedDate.toISOString()],
    queryFn: async () => {
      const res = await api.get(`/classes/schedule?startDate=${formatDateParam(selectedDate)}&endDate=${formatDateParam(selectedDate)}`);
      return res.data?.data as IClass[];
    }
  });

  // Book class Mutation
  const bookMutation = useMutation({
    mutationFn: async (classId: string) => {
      const res = await api.post('/bookings', { classId });
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessMsg(data.message || 'Class booked successfully!');
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Booking failed. You may need an active membership.');
      setSuccessMsg(null);
    }
  });

  const handleBook = (classId: string) => {
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'member') {
      setErrorMsg('Only registered gym members can reserve class slots.');
      return;
    }

    bookMutation.mutate(classId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-charcoal text-brand-ivory overflow-x-hidden">
      <Navbar />

      {/* Header */}
      <section className="relative py-20 px-4 text-center border-b border-brand-beige/10 bg-brand-charcoal-tint/30">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="font-secondary text-xs uppercase tracking-widest text-brand-gold font-medium">
            Daily Session Calendar
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider">
            CLASS SCHEDULE
          </h1>
          <div className="h-[1px] w-24 bg-brand-gold mx-auto" />
        </div>
      </section>

      {/* Main Layout */}
      <main className="max-w-5xl mx-auto px-4 py-20 sm:px-6 lg:px-8 w-full space-y-12">
        
        {/* Alerts */}
        {successMsg ? (
          <div className="rounded-brand bg-green-950/20 border border-green-500/30 p-4 text-sm text-green-400 text-center font-secondary">
            {successMsg}
          </div>
        ) : null}

        {errorMsg ? (
          <div className="rounded-brand bg-red-950/20 border border-red-500/30 p-4 text-sm text-red-400 text-center font-secondary">
            {errorMsg}
          </div>
        ) : null}

        {/* Date Selector Tabs */}
        <div className="flex items-center justify-between border border-brand-beige/10 rounded-brand bg-brand-charcoal-tint p-2 overflow-x-auto gap-2">
          {dates.map((date, idx) => {
            const isSelected = selectedDate.getDate() === date.getDate() && selectedDate.getMonth() === date.getMonth();
            return (
              <button
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(startOfDay(date));
                  setSuccessMsg(null);
                  setErrorMsg(null);
                }}
                className={`flex-1 min-w-[70px] py-3 rounded-brand flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-brand-gold text-brand-charcoal font-semibold shadow-md'
                    : 'bg-transparent text-brand-ivory-muted hover:text-brand-gold hover:bg-brand-charcoal/30'
                }`}
              >
                <span className="font-secondary text-2xs uppercase tracking-wider">
                  {getDayName(date)}
                </span>
                <span className="font-cinzel text-lg font-bold mt-0.5">
                  {getDayNumber(date)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Class Listings */}
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 rounded-brand bg-brand-charcoal-tint border border-brand-beige/5 animate-pulse" />
            ))
          ) : classes && classes.length > 0 ? (
            classes.map((cls) => {
              const slotsLeft = cls.capacity - cls.slotsOccupied;
              const isFull = slotsLeft <= 0;
              return (
                <div
                  key={cls._id}
                  className="rounded-brand border border-brand-beige/10 bg-brand-charcoal-tint p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-gold transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-cinzel text-xl font-bold text-brand-gold">
                        {cls.timeSlot}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-brand-teal/10 text-brand-teal text-3xs font-semibold font-secondary uppercase tracking-wider">
                        {cls.programId?.difficulty || 'Intermediate'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-cinzel text-lg font-semibold tracking-wide text-brand-ivory">
                        {cls.programId?.title || 'Training Session'}
                      </h3>
                      <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed">
                        Led by <span className="text-brand-beige font-semibold">
                          Coach {cls.trainerId?.userId ? `${cls.trainerId.userId.firstName} ${cls.trainerId.userId.lastName}` : 'EliteFit Coach'}
                        </span>
                      </p>
                    </div>

                    <p className="text-2xs text-brand-ivory-muted font-secondary max-w-xl leading-relaxed">
                      {cls.programId?.description || 'Calibrated boutique strength conditioning exercises.'}
                    </p>
                  </div>

                  <div className="flex flex-row md:flex-col items-center justify-between md:justify-center md:items-end gap-4 min-w-[150px] border-t md:border-t-0 border-brand-beige/10 pt-4 md:pt-0">
                    <div className="text-left md:text-right space-y-0.5">
                      <div className="text-xs text-brand-ivory font-secondary">
                        {cls.programId?.durationMinutes || 45} Min | ~{cls.programId?.estimatedCaloriesBurned || 400} kcal
                      </div>
                      <div className={`text-2xs font-secondary ${isFull ? 'text-red-500' : 'text-brand-teal'}`}>
                        {isFull ? 'Class Fully Booked' : `${slotsLeft} Slots Available`}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBook(cls._id)}
                      variant={isFull ? 'outline' : 'primary'}
                      className="text-2xs py-2.5 px-6 uppercase tracking-wider"
                      disabled={isFull || bookMutation.isPending}
                    >
                      {isFull ? 'FULL' : 'BOOK CLASS'}
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center font-secondary text-brand-ivory-muted py-20 border border-brand-beige/10 rounded-brand bg-brand-charcoal-tint/20">
              No classes scheduled for this date. Check another calendar tab.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
