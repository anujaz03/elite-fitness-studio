'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { Navbar, Footer, Input, Button } from '../../components/common';

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  phone: z.string().optional(),
  message: z
    .string()
    .min(5, 'Message must be at least 5 characters')
    .trim()
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const response = await api.post('/contact', data);
      if (response.data?.success) {
        setSuccessMsg(response.data.message || 'Your message has been submitted successfully.');
        reset();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit contact form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-charcoal text-brand-ivory overflow-x-hidden">
      <Navbar />

      {/* Header */}
      <section className="relative py-20 px-4 text-center border-b border-brand-beige/10 bg-brand-charcoal-tint/30">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="font-secondary text-xs uppercase tracking-widest text-brand-gold font-medium">
            GET IN TOUCH
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider">
            CONTACT ELITEFIT
          </h1>
          <div className="h-[1px] w-24 bg-brand-gold mx-auto" />
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Details & Map */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="font-cinzel text-2xl font-bold tracking-wide text-brand-gold">
                STUDIO INFORMATION
              </h2>
              <p className="text-sm text-brand-ivory-muted font-secondary leading-relaxed">
                Have a question regarding our class schedule, membership subscriptions, or facilities? Fill out the contact form and our studio coordinator will get back to you within 24 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-secondary">
              <div className="space-y-2">
                <h4 className="font-semibold text-brand-gold uppercase text-xs tracking-wider">Address</h4>
                <p className="text-brand-ivory-muted leading-relaxed">
                  101 EliteFit Tower, Road No. 4,<br />
                  Jubilee Hills, Hyderabad, India.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-brand-gold uppercase text-xs tracking-wider">Working Hours</h4>
                <p className="text-brand-ivory-muted leading-relaxed">
                  Mon - Fri: 06:00 AM - 10:00 PM<br />
                  Sat - Sun: 07:00 AM - 08:00 PM
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-brand-gold uppercase text-xs tracking-wider">Support Email</h4>
                <p className="text-brand-ivory-muted">contact@elitefitstudio.com</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-brand-gold uppercase text-xs tracking-wider">Hotline</h4>
                <p className="text-brand-ivory-muted">+91 40 1234 5678</p>
              </div>
            </div>

            {/* Mock Map Container */}
            <div className="h-64 rounded-brand overflow-hidden border border-brand-beige/10 relative">
              <Image
                src="/images/gallery/gallery-01.jpg"
                alt="EliteFit Premium Studio Location Map Location"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                <span className="font-cinzel text-xs text-brand-gold tracking-widest bg-brand-charcoal/90 px-4 py-2 border border-brand-gold/30 rounded-brand uppercase">
                  Hyderabad Studio Location
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-brand bg-brand-charcoal-tint border border-brand-beige/10 p-8 shadow-xl space-y-6">
            <h3 className="font-cinzel text-xl font-bold tracking-wide">SEND A MESSAGE</h3>

            {errorMsg ? (
              <div className="rounded-brand bg-red-950/20 border border-red-500/30 p-4 text-sm text-red-400">
                {errorMsg}
              </div>
            ) : null}

            {successMsg ? (
              <div className="rounded-brand bg-green-950/20 border border-green-500/30 p-4 text-sm text-green-400">
                {successMsg}
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Phone Number (Optional)"
                type="text"
                placeholder="+91 98765 43210"
                error={errors.phone?.message}
                {...register('phone')}
              />

              <div className="flex flex-col gap-1.5">
                <label className="font-secondary text-xs font-medium uppercase tracking-wider text-brand-ivory-muted">
                  Message
                </label>
                <textarea
                  placeholder="How can we help you?"
                  rows={4}
                  className={`w-full rounded-brand border bg-brand-charcoal px-4 py-3 text-sm text-brand-ivory transition-all duration-250 ease-out placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal disabled:cursor-not-allowed disabled:opacity-50
                    ${
                      errors.message
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-950/5'
                        : 'border-brand-beige/20 hover:border-brand-beige/40 focus:border-brand-gold'
                    }`}
                  {...register('message')}
                />
                {errors.message ? (
                  <span className="text-xs text-red-500 font-secondary mt-0.5">
                    {errors.message.message}
                  </span>
                ) : null}
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
                  SUBMIT QUERY
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
