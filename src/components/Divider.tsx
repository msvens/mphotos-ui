interface DividerProps {
  className?: string;
  spacing?: {
    top?: number;
    bottom?: number;
  };
}

export function Divider({ className = '', spacing = { top: 8, bottom: 8 } }: DividerProps) {
  const spacingStyles = `my-${spacing.top} mb-${spacing.bottom}`;
  return <hr className={`border-gray-200 dark:border-gray-700 ${spacingStyles} ${className}`} />;
} 