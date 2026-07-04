'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { Input, Button } from '../../components/common';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [devResetToken, setDevResetToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      setDevResetToken(null);

      const response = await api.post('/auth/forgot-password', data);
      if (response.data?.success) {
        setSuccessMsg(response.data.message || 'If this account exists, a password reset link has been dispatched.');
        if (response.data.data?.resetToken) {
          setDevResetToken(response.data.data.resetToken);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Password reset request failed. Please try again.');
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
            RESET PASSWORD
          </h2>
          <p className="mt-2 text-sm text-brand-ivory-muted font-secondary">
            Enter your email to receive a password reset link
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
            {devResetToken ? (
              <div className="mt-2 rounded bg-brand-charcoal p-2 border border-brand-beige/10 text-xs">
                <p className="font-semibold text-brand-gold mb-1">Development Quick Link:</p>
                <Link
                  href={`/reset-password/${devResetToken}`}
                  className="underline text-brand-teal hover:text-brand-gold break-all"
                >
                  Reset Password Simulation Link
                </Link>
              </div>
            ) : null}
            <Link href="/login" className="inline-block w-full pt-2">
              <Button variant="outline" className="w-full">
                BACK TO LOGIN
              </Button>
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
                SEND RESET LINK
              </Button>
            </div>
          </form>
        )}

        {!successMsg ? (
          <div className="text-center text-sm font-secondary">
            <Link href="/login" className="font-medium text-brand-gold hover:underline">
              Back to Sign In
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
