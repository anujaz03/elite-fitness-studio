'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer, Button } from '../../components/common';

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-charcoal text-brand-ivory overflow-x-hidden">
      <Navbar />

      {/* Hero Header */}
      <section className="relative py-20 px-4 text-center border-b border-brand-beige/10 bg-brand-charcoal-tint/30">
        <div className="max-w-3xl mx-auto space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-secondary text-xs uppercase tracking-widest text-brand-gold font-medium"
          >
            Our Legacy
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider"
          >
            ABOUT ELITEFIT STUDIO
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className="h-[1px] w-24 bg-brand-gold mx-auto"
          />
        </div>
      </section>

      {/* Main Content Blocks */}
      <main className="max-w-5xl mx-auto px-4 py-20 sm:px-6 lg:px-8 space-y-24">
        {/* Our Story */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wide text-brand-gold">
              THE STUDIO STORY
            </h2>
            <p className="text-sm text-brand-ivory-muted font-secondary leading-relaxed">
              EliteFit Studio was founded with a singular, clear vision: to establish India&apos;s most premium boutique fitness studio experience. We recognized that conventional commercial gym environments often lack personal coaching attention, clean layouts, and responsive booking software.
            </p>
            <p className="text-sm text-brand-ivory-muted font-secondary leading-relaxed">
              By combining state-of-the-art training machines, bespoke custom workout programs, and a team of internationally certified personal trainers, we deliver a highly calibrated environment where members can target their cardiovascular health, flexibility, and absolute power.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="h-80 rounded-brand overflow-hidden border border-brand-beige/10 relative"
          >
            <Image
              src="/images/about/about-story.jpg"
              alt="EliteFit Premium Boutique Studio Space"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/35 z-10" />
          </motion.div>
        </motion.section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-brand bg-brand-charcoal-tint p-8 border border-brand-beige/10 space-y-4">
            <h3 className="font-cinzel text-lg font-semibold tracking-wide text-brand-gold">
              OUR MISSION
            </h3>
            <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed">
              To motivate and empower individuals to cross their physical boundaries through a luxury boutique training environment, custom nutritional guidance, and certified, professional instruction.
            </p>
          </div>

          <div className="rounded-brand bg-brand-charcoal-tint p-8 border border-brand-beige/10 space-y-4">
            <h3 className="font-cinzel text-lg font-semibold tracking-wide text-brand-teal">
              OUR VISION
            </h3>
            <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed">
              To set the industry benchmark for high-end boutique fitness services by merging cutting-edge physical conditioning sciences with seamless digital dashboard booking convenience.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-cinzel text-2xl font-bold tracking-wide">CORE VALUES</h2>
            <div className="h-[1px] w-12 bg-brand-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center font-secondary">
            <div className="space-y-2">
              <div className="text-brand-gold text-lg font-semibold">LUXURY</div>
              <p className="text-xs text-brand-ivory-muted leading-relaxed">Providing a premium environment in every detail.</p>
            </div>
            <div className="space-y-2">
              <div className="text-brand-gold text-lg font-semibold">STRENGTH</div>
              <p className="text-xs text-brand-ivory-muted leading-relaxed">Fostering high performance and physical capacity.</p>
            </div>
            <div className="space-y-2">
              <div className="text-brand-gold text-lg font-semibold">DISCIPLINE</div>
              <p className="text-xs text-brand-ivory-muted leading-relaxed">Supporting consistency, routine, and dedication.</p>
            </div>
            <div className="space-y-2">
              <div className="text-brand-gold text-lg font-semibold">MOTIVATION</div>
              <p className="text-xs text-brand-ivory-muted leading-relaxed">Creating an inspiring environment that drives action.</p>
            </div>
          </div>
        </section>
      </main>

      {/* CTA section */}
      <section className="py-20 px-4 text-center relative border-t border-brand-beige/10 bg-brand-charcoal-tint/10">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-cinzel text-3xl font-bold tracking-wider">
            READY TO JOIN THE ELITE?
          </h2>
          <p className="text-xs text-brand-ivory-muted font-secondary max-w-sm mx-auto leading-relaxed">
            Begin your training journey with us today and feel the premium boutique difference.
          </p>
          <Link href="/register" className="inline-block mt-4">
            <Button variant="primary" className="py-4 px-10 tracking-widest uppercase text-xs">
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
