'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import api from '../../services/api';
import { Button } from '../../components/common';

function VerificationHandler() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Verifying your email address...');

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing email verification token.');
        return;
      }

      try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        if (response.data?.success) {
          setStatus('success');
          setMessage(response.data.message || 'Your email address has been verified successfully!');
        } else {
          setStatus('error');
          setMessage('Email verification failed. The token may be invalid or expired.');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Email verification failed. The token may be invalid or expired.');
      }
    };

    performVerification();
  }, [token]);

  return (
    <div className="space-y-6 text-center">
      {status === 'loading' ? (
        <div className="flex flex-col items-center gap-4">
          <svg
            className="h-12 w-12 animate-spin text-brand-gold"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-brand-ivory-muted font-secondary text-sm">{message}</p>
        </div>
      ) : null}

      {status === 'success' ? (
        <div className="space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-950/20 border border-green-500/30 text-green-400">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="font-cinzel text-2xl font-semibold text-brand-ivory">VERIFICATION SUCCESSFUL</h2>
          <p className="text-brand-ivory-muted font-secondary text-sm">{message}</p>
          <Link href="/login" className="inline-block w-full">
            <Button variant="primary" className="w-full">
              PROCEED TO LOGIN
            </Button>
          </Link>
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-950/20 border border-red-500/30 text-red-400">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="font-cinzel text-2xl font-semibold text-brand-ivory">VERIFICATION FAILED</h2>
          <p className="text-brand-ivory-muted font-secondary text-sm">{message}</p>
          <div className="flex flex-col gap-3">
            <Link href="/register" className="inline-block w-full">
              <Button variant="outline" className="w-full">
                BACK TO REGISTER
              </Button>
            </Link>
            <Link href="/" className="text-xs text-brand-gold hover:underline font-secondary">
              Go back to Homepage
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-charcoal px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-brand bg-brand-charcoal-tint border border-brand-beige/10 p-8 shadow-xl">
        <div className="text-center mb-6">
          <Link href="/" className="font-cinzel text-2xl font-bold tracking-widest text-brand-gold hover:opacity-90">
            ELITEFIT
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="text-center font-secondary text-sm text-brand-ivory-muted">
              Loading verification parameters...
            </div>
          }
        >
          <VerificationHandler />
        </Suspense>
      </div>
    </div>
  );
}
