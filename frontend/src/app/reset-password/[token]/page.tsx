'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../../services/api';
import { Input, Button } from '../../../components/common';

const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Confirm password is required')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type ResetPasswordValues = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      if (!token || typeof token !== 'string') {
        setErrorMsg('Invalid or missing password reset token.');
        return;
      }

      const response = await api.post(`/auth/reset-password/${token}`, {
        password: data.password
      });

      if (response.data?.success) {
        setSuccessMsg(response.data.message || 'Your password has been reset successfully!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Password reset failed. The token may be invalid or expired.');
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
            CONFIRM RESET
          </h2>
          <p className="mt-2 text-sm text-brand-ivory-muted font-secondary">
            Set your new password to restore account access
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
            <Link href="/login" className="inline-block w-full pt-2">
              <Button variant="primary" className="w-full">
                GO TO LOGIN
              </Button>
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <div>
              <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
                RESET PASSWORD
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
