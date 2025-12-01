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
import { useMPContext } from '@/context/MPContext';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Photo', href: '/photo', icon: PhotoIcon },
  { name: 'Album', href: '/album', icon: FolderIcon },
  { name: 'Camera', href: '/camera', icon: CameraIcon },
  { name: 'Guest', href: '/guest', icon: UserIcon },
];

export default function Navbar() {
  const pathname = usePathname();
  const { uxConfig } = useMPContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Dense mode: smaller height and icon size
  const isDense = uxConfig.denseTopBar;
  const navHeight = isDense ? 'h-10' : 'h-12'; // 40px vs 48px
  const iconSize = isDense ? 'medium' : 'large'; // Passed to IconButton
  const mobileIconSize = isDense ? 'w-6 h-6' : 'w-8 h-8'; // Mobile menu icons
  const paddingY = isDense ? 'py-1' : 'py-2';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-gray-700">
      <div className={`px-1 mx-auto max-w-full ${paddingY}`}>
        <div className={`flex justify-between ${navHeight}`}>
          {/* App Name - Left aligned */}
          <div className="flex items-center flex-shrink-0 pl-1">
            <Link href="/" className="text-base font-light text-gray-900 dark:text-white leading-tight tracking-widest uppercase">
              <span className="block">Mellowtech</span>
              <span className="block">Photos</span>
            </Link>
          </div>
          
          {/* Navigation Icons - Right aligned */}
          <div className="flex items-center pr-1">
            <div className="hidden md:flex md:space-x-1">
              {navigation.map((item) => {
                // For home, exact match only. For others, check if pathname starts with href
                const isActive = item.href === '/'
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center justify-center"
                    title={item.name}
                  >
                    <IconButton
                      icon={item.icon}
                      size={iconSize}
                      className={isActive
                        ? 'text-gray-900 dark:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                        : 'text-gray-600 dark:text-gray-400 bg-transparent hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
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
                size={iconSize}
                className="text-gray-600 dark:text-gray-400 bg-transparent hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-200 z-40 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed ${isDense ? 'top-10' : 'top-12'} right-0 ${isDense ? 'h-[calc(100vh-40px)]' : 'h-[calc(100vh-48px)]'} w-56 bg-white dark:bg-dark-bg border-l border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-200 ease-in-out z-50 ${
          isMenuOpen
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <div className="py-2">
          {navigation.map((item) => {
            // For home, exact match only. For others, check if pathname starts with href
            const isActive = item.href === '/'
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-4 ${isDense ? 'py-2' : 'py-3'} transition-colors ${
                  isActive
                    ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className={`${mobileIconSize} stroke-[1.25]`} aria-hidden="true" />
                <span className={`ml-4 ${isDense ? 'text-base' : 'text-lg'} font-light`}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 