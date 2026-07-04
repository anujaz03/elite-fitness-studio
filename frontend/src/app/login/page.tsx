'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components/common';

const loginFormSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required')
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect email address or password.');
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
            WELCOME BACK
          </h2>
          <p className="mt-2 text-sm text-brand-ivory-muted font-secondary">
            Enter your credentials to access your dashboard
          </p>
        </div>

        {errorMsg ? (
          <div className="rounded-brand bg-red-950/20 border border-red-500/30 p-4 text-sm text-red-400">
            {errorMsg}
          </div>
        ) : null}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand-gold hover:underline font-secondary"
            >
              Forgot your password?
            </Link>
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
              SIGN IN
            </Button>
          </div>
        </form>

        <div className="text-center text-sm font-secondary">
          <span className="text-brand-ivory-muted">Don&apos;t have an account? </span>
          <Link href="/register" className="font-medium text-brand-gold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
