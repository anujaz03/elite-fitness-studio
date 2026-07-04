'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-brand border border-brand-beige/15 bg-brand-charcoal/75 px-6 py-3 backdrop-blur-md shadow-lg flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-cinzel text-xl font-bold tracking-widest text-brand-gold">
          ELITEFIT
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`font-secondary text-xs uppercase tracking-wider transition-colors duration-250 ${
                isActive(link.path)
                  ? 'text-brand-gold font-semibold'
                  : 'text-brand-ivory-muted hover:text-brand-gold'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth CTA */}
        <div className="hidden md:block">
          {user ? (
            <Link href="/dashboard">
              <Button variant="secondary" className="text-xs px-5 py-2">
                DASHBOARD
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="primary" className="text-xs px-5 py-2">
                SIGN IN
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-brand-ivory hover:text-brand-gold focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen ? (
        <div className="md:hidden mt-2 rounded-brand border border-brand-beige/15 bg-brand-charcoal p-4 shadow-xl flex flex-col gap-4 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`font-secondary text-xs uppercase tracking-wider py-2 transition-colors ${
                isActive(link.path) ? 'text-brand-gold font-semibold' : 'text-brand-ivory-muted'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-brand-beige/10" />
          {user ? (
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <Button variant="secondary" className="w-full text-xs py-2.5">
                DASHBOARD
              </Button>
            </Link>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button variant="primary" className="w-full text-xs py-2.5">
                SIGN IN
              </Button>
            </Link>
          )}
        </div>
      ) : null}
    </nav>
  );
};
export default Navbar;
