import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  showDivider?: boolean;
}

export function Section({ 
  children, 
  className = '', 
  spacing = 'md',
  showDivider = false 
}: SectionProps) {
  // Define spacing values using Tailwind classes
  const spacingMap = {
    sm: 'mb-4',    // 1rem (16px)
    md: 'mb-8',    // 2rem (32px)
    lg: 'mb-12',   // 3rem (48px)
    xl: 'mb-16'    // 4rem (64px)
  };

  // Define divider top margin to match section spacing
  const dividerSpacingMap = {
    sm: 'mt-4',    // 1rem (16px)
    md: 'mt-8',    // 2rem (32px)
    lg: 'mt-12',   // 3rem (48px)
    xl: 'mt-16'    // 4rem (64px)
  };

  return (
    <div className={`w-full ${spacingMap[spacing]} ${className}`}>
      {children}
      {showDivider && <hr className={`border-gray-200 dark:border-gray-700 ${dividerSpacingMap[spacing]}`} />}
    </div>
  );
} 