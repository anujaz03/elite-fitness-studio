'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import api from '../../../services/api';
import { Navbar, Footer, Button } from '../../../components/common';

function PaymentSimulationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const gateway = searchParams.get('gateway') || 'stripe';
  const orderId = searchParams.get('orderId') || 'unknown';
  const planName = searchParams.get('planName') || 'Standard Plan';
  const amount = searchParams.get('amount') || '0';
  const planId = searchParams.get('planId') || '';

  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(true);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/payments/verify', {
        transactionId: orderId,
        gateway,
        planId
      });
      return res.data;
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      setMessage(data.message || 'Payment verified. Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
    },
    onError: (err: any) => {
      setIsSuccess(false);
      setMessage(err.message || 'Payment verification failed on the server.');
    }
  });

  const handleSimulateSuccess = () => {
    setMessage('Processing simulated checkout success...');
    verifyMutation.mutate();
  };

  const handleSimulateFailure = () => {
    setIsSuccess(false);
    setMessage('Simulated payment checkout failed. Redirecting to dashboard...');
    setTimeout(() => {
      router.push('/dashboard');
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-charcoal text-brand-ivory overflow-x-hidden">
      <Navbar />

      <main className="max-w-md mx-auto w-full px-4 py-20 flex-grow flex flex-col justify-center">
        <div className="rounded-brand border border-brand-beige/10 bg-brand-charcoal-tint p-8 shadow-2xl space-y-6 text-center">
          
          <div className="space-y-2">
            <span className="text-3xs uppercase tracking-widest text-brand-gold font-semibold font-secondary">
              Gateway Sandbox Sandbox
            </span>
            <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide">
              {gateway.toUpperCase()} CHECKOUT
            </h1>
            <p className="text-xs text-brand-ivory-muted font-secondary">
              Order reference: <span className="font-mono text-brand-teal">{orderId.substring(0, 16)}</span>
            </p>
          </div>

          <hr className="border-brand-beige/10" />

          {/* Details Card */}
          <div className="rounded-brand bg-brand-charcoal p-6 border border-brand-beige/5 space-y-4 text-left font-secondary">
            <div className="flex justify-between text-xs">
              <span className="text-brand-ivory-muted">Membership Package:</span>
              <span className="font-semibold uppercase text-brand-gold">{planName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-brand-ivory-muted">Amount Due:</span>
              <span className="font-semibold text-brand-teal">INR {amount}</span>
            </div>
          </div>

          {/* Feedback display */}
          {message ? (
            <div className={`rounded-brand border p-4 text-xs font-secondary leading-relaxed ${
              isSuccess 
                ? 'bg-green-950/20 border-green-500/30 text-green-400' 
                : 'bg-red-950/20 border-red-500/30 text-red-400'
            }`}>
              {message}
            </div>
          ) : null}

          {/* Simulated card fields */}
          <div className="space-y-4 text-left">
            <div className="h-40 rounded-brand bg-gradient-to-br from-brand-charcoal to-brand-charcoal-tint border border-brand-beige/15 p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-brand-teal/5 blur-[50px] rounded-full pointer-events-none" />
              <div className="flex justify-between items-start">
                <span className="font-cinzel text-xs tracking-widest text-brand-beige/50">ELITEFIT SECURE</span>
                <span className="text-3xs text-brand-gold font-semibold uppercase">{gateway} sandbox</span>
              </div>
              <div className="font-mono text-sm tracking-widest text-brand-beige">
                •••• •••• •••• 4242
              </div>
              <div className="flex justify-between items-end">
                <span className="text-3xs font-mono text-brand-ivory-muted">TEST USER</span>
                <span className="text-3xs font-mono text-brand-ivory-muted">12 / 29</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {!verifyMutation.isPending && !message ? (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button onClick={handleSimulateSuccess} variant="primary" className="text-3xs py-3 uppercase">
                Authorize Success
              </Button>
              <Button onClick={handleSimulateFailure} variant="outline" className="text-3xs py-3 border-red-500 text-red-500 hover:bg-red-500 hover:text-brand-charcoal uppercase">
                Decline
              </Button>
            </div>
          ) : (
            <div className="text-center text-xs text-brand-ivory-muted font-secondary py-3 animate-pulse">
              Simulating sandbox operations...
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentSimulationPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-brand-charcoal text-brand-ivory items-center justify-center font-cinzel tracking-widest text-xs">
        LOADING PAYMENT GATEWAY CHECKOUT...
      </div>
    }>
      <PaymentSimulationContent />
    </Suspense>
  );
}
