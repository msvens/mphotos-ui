'use client';

import Navbar from "@/components/Navbar";
import { MPContextProvider } from '@/context/MPContext';
import { ToastProvider } from '@/context/ToastContext';
import { Footer } from '@/components/Footer';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <MPContextProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <main className="px-4 max-w-6xl mx-auto w-full">
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </ToastProvider>
    </MPContextProvider>
  );
} 