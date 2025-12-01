import { ComponentType, SVGProps } from 'react';
import { Tooltip, TooltipPlacement } from './Tooltip';

type IconButtonSize = 'small' | 'medium' | 'large' | 'nav';

interface IconButtonProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  size?: IconButtonSize;
  disabled?: boolean;
  title?: string;
  tooltipPlacement?: TooltipPlacement;
  className?: string;
  iconClassName?: string;
  background?: string; // Optional background color (e.g., 'rgba(0,0,0,0.5)')
}

const sizeClasses = {
  small: {
    button: 'w-8 h-8',
    icon: 'w-4 h-4'
  },
  medium: {
    button: 'w-10 h-10',
    icon: 'w-6 h-6'
  },
  large: {
    button: 'w-16 h-16',
    icon: 'w-8 h-8 stroke-[1.25]'
  },
  nav: {
    button: 'w-12 h-12',
    icon: 'w-8 h-8 stroke-[1.5]'
  }
};

export function IconButton({
  icon: Icon,
  onClick,
  size = 'medium',
  disabled = false,
  title,
  tooltipPlacement,
  className = '',
  iconClassName = '',
  background
}: IconButtonProps) {
  const { button: buttonSize, icon: iconSize } = sizeClasses[size];

  // When background is set, use brightness filter for hover; otherwise use bg color change
  const hoverClasses = background
    ? 'hover:brightness-150 active:scale-90'
    : 'hover:bg-gray-300 dark:hover:bg-gray-700 active:bg-gray-400/20 active:scale-90';

  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      style={background ? { backgroundColor: background } : undefined}
      className={`flex items-center justify-center rounded-full
        disabled:opacity-50 disabled:cursor-not-allowed
        ${hoverClasses}
        transition-all duration-150
        ${buttonSize}
        ${className}`}
    >
      <Icon className={`${iconSize} ${iconClassName}`} />
    </button>
  );

  if (title) {
    return <Tooltip title={title} placement={tooltipPlacement}>{button}</Tooltip>;
  }

  return button;
} 