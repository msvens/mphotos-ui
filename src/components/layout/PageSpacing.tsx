type PageSpacingHeight = 'default' | 'no_spacing' | string;

interface PageSpacingProps {
  // Height can be 'default' (96px), 'no_spacing' (48px - navbar height), or any arbitrary value
  height?: PageSpacingHeight;
  // Optional className for additional styling
  className?: string;
}

export function PageSpacing({ height = 'default', className = "" }: PageSpacingProps) {
  const getHeight = () => {
    switch (height) {
      case 'default':
        return '96px';
      case 'no_spacing':
        return '48px'; // Navbar height
      default:
        return height;
    }
  };

  return <div style={{ height: getHeight() }} className={className} />;
} 