'use client';

import Link from 'next/link';
import { useMPContext } from '@/context/MPContext';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  isDense: boolean;
}

function FooterLink({ href, children, isDense }: FooterLinkProps) {
  const textSize = isDense ? 'text-[10px]' : 'text-xs';
  const spacing = isDense ? 'mx-2' : 'mx-4';

  return (
    <Link
      href={href}
      className={`uppercase ${spacing} ${textSize} text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors`}
    >
      {children}
    </Link>
  );
}

export function Footer() {
  const { uxConfig } = useMPContext();
  const isDense = uxConfig.denseBottomBar;
  const paddingTop = isDense ? 'pt-6' : 'pt-12';
  const paddingBottom = isDense ? 'pb-2' : 'pb-4';

  return (
    <footer className="w-full">
      <div className={`max-w-7xl mx-auto px-4 ${paddingTop} ${paddingBottom} flex justify-center items-center`}>
        <div className="flex-1" />
        <FooterLink href="/about" isDense={isDense}>About</FooterLink>
        <FooterLink href="/resume" isDense={isDense}>Resume</FooterLink>
        <FooterLink href="/" isDense={isDense}>Mellowtech.org</FooterLink>
        <FooterLink href="/account" isDense={isDense}>Account</FooterLink>
        <div className="flex-1" />
      </div>
    </footer>
  );
} 