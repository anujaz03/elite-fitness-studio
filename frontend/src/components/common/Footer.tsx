import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-charcoal-tint border-t border-brand-beige/10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Bio */}
          <div className="space-y-4">
            <Link href="/" className="font-cinzel text-xl font-bold tracking-widest text-brand-gold">
              ELITEFIT
            </Link>
            <p className="text-sm text-brand-ivory-muted font-secondary leading-relaxed">
              Experience the pinnacle of physical performance. Luxury boutique training environment, custom workout programs, and world-class certified coaches.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-sm font-semibold tracking-wider text-brand-gold uppercase">
              Navigation
            </h4>
            <ul className="space-y-2 font-secondary text-xs uppercase tracking-wider">
              <li>
                <Link href="/" className="text-brand-ivory-muted hover:text-brand-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-brand-ivory-muted hover:text-brand-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-brand-ivory-muted hover:text-brand-gold transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-brand-ivory-muted hover:text-brand-gold transition-colors">
                  Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-sm font-semibold tracking-wider text-brand-gold uppercase">
              Contact
            </h4>
            <p className="text-sm text-brand-ivory-muted font-secondary leading-relaxed">
              101 EliteFit Tower, Road No. 4,<br />
              Jubilee Hills, Hyderabad, India.<br />
              <span className="font-semibold text-brand-gold">Email:</span> contact@elitefitstudio.com<br />
              <span className="font-semibold text-brand-gold">Phone:</span> +91 40 1234 5678
            </p>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-sm font-semibold tracking-wider text-brand-gold uppercase">
              Newsletter
            </h4>
            <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed">
              Subscribe to receive training guides, nutritional blueprints, and VIP announcements.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="name@example.com"
                required
                className="h-10 w-full rounded-brand border border-brand-beige/20 bg-brand-charcoal px-3 text-xs text-brand-ivory placeholder:text-neutral-500 focus:border-brand-gold focus:outline-none"
              />
              <button
                type="submit"
                className="h-10 rounded-brand bg-brand-gold px-4 text-xs font-semibold text-brand-charcoal hover:bg-opacity-95"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-brand-beige/15 mt-12 pt-8 text-center text-xs text-brand-ivory-muted font-secondary flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} EliteFit Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-brand-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
