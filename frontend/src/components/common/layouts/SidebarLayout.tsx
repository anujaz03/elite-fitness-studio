'use client';

import React from 'react';
import { useUIStore } from '../../../store/uiStore';

interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function SidebarLayout({ sidebar, children }: SidebarLayoutProps) {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="min-h-screen flex bg-brand-charcoal text-brand-ivory">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-brand-charcoal-tint border-r border-brand-beige/10 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">{sidebar}</div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default SidebarLayout;
