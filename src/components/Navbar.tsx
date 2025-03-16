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
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { IconButton } from './IconButton';

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
                    className="inline-flex items-center justify-center"
                    title={item.name}
                  >
                    <IconButton
                      icon={item.icon}
                      size="large"
                      className={isActive
                        ? 'text-mui-text-primary bg-transparent hover:bg-mui-background-hover'
                        : 'text-mui-text-secondary bg-transparent hover:text-mui-text-primary hover:bg-mui-background-hover'
                      }
                    />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <IconButton
                icon={Bars3Icon}
                onClick={toggleMenu}
                size="large"
                className="text-mui-text-secondary bg-transparent hover:text-mui-text-primary hover:bg-mui-background-hover"
              />
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