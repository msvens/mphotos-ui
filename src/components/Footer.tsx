import Link from 'next/link';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link 
      href={href} 
      className="uppercase mx-4 text-xs hover:text-gray-600 transition-colors"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center items-center">
        <div className="flex-1" />
        <FooterLink href="/about">About</FooterLink>
        <FooterLink href="/resume">Resume</FooterLink>
        <FooterLink href="/">Mellowtech.org</FooterLink>
        <FooterLink href="/account">Account</FooterLink>
        <div className="flex-1" />
      </div>
    </footer>
  );
} 