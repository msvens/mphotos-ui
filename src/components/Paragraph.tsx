import { ReactNode } from 'react';

interface ParagraphProps {
  children: ReactNode;
  className?: string;
  gutterBottom?: boolean;
}

export function Paragraph({ children, className = '', gutterBottom = true }: ParagraphProps) {
  const baseStyles = 'text-base leading-relaxed';
  const spacingStyles = gutterBottom ? 'mb-4' : '';
  const combinedStyles = `${baseStyles} ${spacingStyles} ${className}`;

  return <p className={combinedStyles}>{children}</p>;
} 