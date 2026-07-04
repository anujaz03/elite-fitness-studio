import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function PageContainer({ children, className = '', id }: PageContainerProps) {
  return (
    <main
      id={id}
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 ${className}`}
    >
      {children}
    </main>
  );
}

export default PageContainer;
