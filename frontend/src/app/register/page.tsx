'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { Input, Button } from '../../components/common';

const registerFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .trim(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [devVerificationToken, setDevVerificationToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: ''
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      setDevVerificationToken(null);

      const response = await api.post('/auth/register', data);
      if (response.data?.success) {
        setSuccessMsg(response.data.message || 'Registration completed. Check email to verify.');
        if (response.data.data?.verificationToken) {
          setDevVerificationToken(response.data.data.verificationToken);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-charcoal px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-brand bg-brand-charcoal-tint border border-brand-beige/10 p-8 shadow-xl">
        <div className="text-center">
          <Link href="/" className="font-cinzel text-2xl font-bold tracking-widest text-brand-gold hover:opacity-90">
            ELITEFIT
          </Link>
          <h2 className="mt-6 font-cinzel text-3xl font-semibold tracking-wide text-brand-ivory">
            CREATE ACCOUNT
          </h2>
          <p className="mt-2 text-sm text-brand-ivory-muted font-secondary">
            Join EliteFit to start booking premium classes
          </p>
        </div>

        {errorMsg ? (
          <div className="rounded-brand bg-red-950/20 border border-red-500/30 p-4 text-sm text-red-400">
            {errorMsg}
          </div>
        ) : null}

        {successMsg ? (
          <div className="rounded-brand bg-green-950/20 border border-green-500/30 p-4 text-sm text-green-400 space-y-3">
            <p>{successMsg}</p>
            {devVerificationToken ? (
              <div className="mt-2 rounded bg-brand-charcoal p-2 border border-brand-beige/10 text-xs">
                <p className="font-semibold text-brand-gold mb-1">Development Quick Link:</p>
                <Link
                  href={`/verify-email?token=${devVerificationToken}`}
                  className="underline text-brand-teal hover:text-brand-gold break-all"
                >
                  Verify Email Simulation Link
                </Link>
              </div>
            ) : null}
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="John"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Phone Number"
                type="text"
                placeholder="+91 98765 43210"
                error={errors.phone?.message}
                {...register('phone')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div>
              <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
                CREATE ACCOUNT
              </Button>
            </div>
          </form>
        )}

        <div className="text-center text-sm font-secondary">
          <span className="text-brand-ivory-muted">Already have an account? </span>
          <Link href="/login" className="font-medium text-brand-gold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
