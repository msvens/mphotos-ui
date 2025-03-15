'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  HomeIcon,
  PhotoIcon,
  FolderIcon,
  CameraIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Photo', href: '/photo', icon: PhotoIcon },
  { name: 'Album', href: '/album', icon: FolderIcon },
  { name: 'Camera', href: '/camera', icon: CameraIcon },
  { name: 'Guest', href: '/guest', icon: UserIcon },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-mui-background-paper border-b border-mui-divider">
      <div className="px-1 mx-auto max-w-full py-2">
        <div className="flex justify-between h-12">
          {/* App Name - Left aligned */}
          <div className="flex items-center flex-shrink-0 pl-1">
            <Link href="/" className="text-base font-light text-mui-text-primary leading-tight tracking-widest uppercase">
              <span className="block">Mellowtech</span>
              <span className="block">Photos</span>
            </Link>
          </div>
          
          {/* Navigation Icons - Right aligned */}
          <div className="flex items-center pr-1">
            <div className="hidden md:flex md:space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full transition-colors ${
                      isActive
                        ? 'text-mui-text-primary hover:bg-mui-background-hover'
                        : 'text-mui-text-secondary hover:text-mui-text-primary hover:bg-mui-background-hover'
                    }`}
                    title={item.name}
                  >
                    <item.icon className="w-8 h-8 stroke-[1.25]" aria-hidden="true" />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center w-16 h-16 text-mui-text-secondary rounded-full hover:text-mui-text-primary hover:bg-mui-background-hover focus:outline-none focus:ring-2 focus:ring-mui-primary focus:ring-offset-2 focus:ring-offset-mui-background-paper"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`w-8 h-8 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.25"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-200 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile menu */}
      <div 
        className={`md:hidden fixed top-[88px] right-0 h-[calc(100vh-88px)] w-56 bg-mui-background-paper border-l border-mui-divider shadow-lg transition-all duration-200 ease-in-out ${
          isMenuOpen 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <div className="py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-4 py-3 transition-colors ${
                  isActive
                    ? 'text-mui-text-primary hover:bg-mui-background-hover'
                    : 'text-mui-text-secondary hover:text-mui-text-primary hover:bg-mui-background-hover'
                }`}
              >
                <item.icon className="w-8 h-8 stroke-[1.25]" aria-hidden="true" />
                <span className="ml-4 text-lg font-light">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 