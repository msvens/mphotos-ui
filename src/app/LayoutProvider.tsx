'use client';

import Navbar from "@/components/Navbar";
import { MPContextProvider } from '@/context/MPContext';
import { Footer } from '@/components/Footer';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <MPContextProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <main className="px-4 max-w-6xl mx-auto w-full">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </MPContextProvider>
  );
} 