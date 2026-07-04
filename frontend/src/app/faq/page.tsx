'use client';

import React, { useState } from 'react';
import { Navbar, Footer } from '../../components/common';

interface IFAQ {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: IFAQ[] = [
    {
      question: 'How do I book a class at EliteFit?',
      answer: 'First, register for an account and log in. Once logged in, navigate to the Schedule page, view the class sessions, and click "Book Class". If you have an active membership subscription, the slot will be reserved immediately. Otherwise, you will be prompted to purchase a membership plan.'
    },
    {
      question: 'What is the cancellation policy for bookings?',
      answer: 'Members can cancel or reschedule bookings up to 4 hours before the scheduled class starts. Within the 4-hour window, cancellations are locked to ensure other waiting list members have enough time to reserve the open slot. You can manage cancellations directly from your User Dashboard.'
    },
    {
      question: 'What membership plans do you offer?',
      answer: 'We offer Monthly, Quarterly, and Annual plans. The Quarterly plan includes a 10% discount and additional guest passes, while the Annual plan provides a 30% discount, unlimited guest passes (one at a time), and twelve complimentary personal training consultations. See the pricing catalog for details.'
    },
    {
      question: 'Can I purchase memberships internationally?',
      answer: 'Yes. We support local domestic payments via Razorpay (net banking, UPI, cards) and international card checkouts via Stripe, enabling you to secure your gym pass prior to traveling.'
    },
    {
      question: 'Are lockers and towel service included?',
      answer: 'Yes. All active membership plans grant access to our luxury vanity suite locker rooms, complete with complimentary premium towel service, high-end grooming toiletries, and steam room facilities.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-charcoal text-brand-ivory overflow-x-hidden">
      <Navbar />

      {/* Header */}
      <section className="relative py-20 px-4 text-center border-b border-brand-beige/10 bg-brand-charcoal-tint/30">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="font-secondary text-xs uppercase tracking-widest text-brand-gold font-medium">
            FAQS
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <div className="h-[1px] w-24 bg-brand-gold mx-auto" />
        </div>
      </section>

      {/* Accordions */}
      <main className="max-w-3xl mx-auto px-4 py-20 sm:px-6 lg:px-8 w-full">
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-brand border border-brand-beige/10 bg-brand-charcoal-tint overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-cinzel text-sm sm:text-base font-semibold tracking-wide text-brand-ivory hover:text-brand-gold transition-colors">
                    {faq.question}
                  </span>
                  <span className="text-brand-gold ml-4">
                    {isOpen ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96 border-t border-brand-beige/5' : 'max-h-0'
                  }`}
                >
                  <p className="p-6 text-xs sm:text-sm text-brand-ivory-muted font-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
