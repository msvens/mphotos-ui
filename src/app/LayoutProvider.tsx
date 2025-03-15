'use client';

import Navbar from "@/components/Navbar";
import { MPContextProvider } from '@/context/MPContext';
import { Footer } from '@/components/Footer';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <MPContextProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-[96px] flex-grow"> {/* 48px (Navbar height) + 48px extra spacing */}
          <main className="px-4 max-w-6xl mx-auto w-full">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </MPContextProvider>
  );
} 