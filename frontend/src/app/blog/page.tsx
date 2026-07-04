'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import api from '../../services/api';
import { Navbar, Footer, Button } from '../../components/common';

interface IBlog {
  _id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  content: string;
  thumbnailUrl: string;
  publishedAt?: string;
  createdAt: string;
}

export default function BlogPage() {
  const [activeBlog, setActiveBlog] = useState<IBlog | null>(null);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await api.get('/blogs');
      return res.data?.data as IBlog[];
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-brand-charcoal text-brand-ivory overflow-x-hidden">
      <Navbar />

      {/* Header */}
      <section className="relative py-20 px-4 text-center border-b border-brand-beige/10 bg-brand-charcoal-tint/30">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="font-secondary text-xs uppercase tracking-widest text-brand-gold font-medium">
            Read Our Blueprint
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider">
            FITNESS & NUTRITION BLOG
          </h1>
          <div className="h-[1px] w-24 bg-brand-gold mx-auto" />
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-96 rounded-brand bg-brand-charcoal-tint border border-brand-beige/5 animate-pulse" />
            ))}
          </div>
        ) : blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="group rounded-brand overflow-hidden border border-brand-beige/10 bg-brand-charcoal-tint transition-all duration-250 hover:border-brand-gold hover:translate-y-[-4px] flex flex-col justify-between"
              >
                <div className="h-[220px] w-full relative overflow-hidden">
                  <Image
                    src={blog.thumbnailUrl || '/images/blog/wellness-blog.jpg'}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal-tint via-transparent to-transparent z-20" />
                </div>
                <div className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-brand-gold font-semibold font-secondary">
                        {blog.category}
                      </span>
                      <span className="text-xs text-brand-ivory-muted font-secondary">
                        {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="font-cinzel text-xl font-semibold tracking-wide text-brand-ivory">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-brand-ivory-muted font-secondary leading-relaxed line-clamp-3">
                      {blog.content}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-brand-beige/10 flex items-center justify-between">
                    <span className="text-xs text-brand-teal font-secondary font-medium">
                      By {blog.author}
                    </span>
                    <button
                      onClick={() => setActiveBlog(blog)}
                      className="text-xs text-brand-gold hover:underline font-secondary font-semibold"
                    >
                      Read Article
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center font-secondary text-brand-ivory-muted py-20">
            No blog articles published yet. Please seed the database or check back later.
          </div>
        )}
      </main>

      {/* Blog Reading Modal */}
      {activeBlog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-brand-charcoal/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-brand bg-brand-charcoal-light border border-brand-beige/10 p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setActiveBlog(null)}
              className="absolute top-4 right-4 text-brand-ivory hover:text-brand-gold focus:outline-none"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-brand-gold font-semibold font-secondary">
                {activeBlog.category}
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wide text-brand-ivory pr-6">
                {activeBlog.title}
              </h2>
              <p className="text-xs text-brand-ivory-muted font-secondary">
                Published on {new Date(activeBlog.publishedAt || activeBlog.createdAt).toLocaleDateString()} | By {activeBlog.author}
              </p>
            </div>

            <hr className="border-brand-beige/10" />

            <div className="text-sm text-brand-ivory-muted font-secondary leading-relaxed whitespace-pre-wrap">
              {activeBlog.content}
            </div>

            <div className="pt-4 flex justify-end">
              <Button variant="outline" onClick={() => setActiveBlog(null)} className="text-xs">
                CLOSE ARTICLE
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}
