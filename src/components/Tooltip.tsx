'use client';

import { ReactNode, useState, useRef } from 'react';

export type TooltipPlacement =
  | 'top' | 'bottom' | 'left' | 'right'
  | 'bottom-left' | 'bottom-right'
  | 'top-left' | 'top-right';

export interface TooltipProps {
  children: ReactNode;
  title: string;
  placement?: TooltipPlacement;
}

export function Tooltip({ children, title, placement = 'right' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return {};

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const gap = 8;
    const tooltipWidth = 150; // approximate for centered placements
    const tooltipHeight = 24; // approximate

    switch (placement) {
      case 'top':
        return {
          top: triggerRect.top - tooltipHeight - gap,
          left: triggerRect.left + (triggerRect.width - tooltipWidth) / 2,
        };
      case 'bottom':
        return {
          top: triggerRect.bottom + gap,
          left: triggerRect.left + (triggerRect.width - tooltipWidth) / 2,
        };
      case 'left':
        return {
          top: triggerRect.top + (triggerRect.height - tooltipHeight) / 2,
          left: triggerRect.left - tooltipWidth - gap,
        };
      case 'right':
        return {
          top: triggerRect.top + (triggerRect.height - tooltipHeight) / 2,
          left: triggerRect.right + gap,
        };
      case 'bottom-left':
        // Below, right-aligned with button (extends left)
        return {
          top: triggerRect.bottom + gap,
          right: window.innerWidth - triggerRect.right,
        };
      case 'bottom-right':
        // Below, left-aligned with button (extends right)
        return {
          top: triggerRect.bottom + gap,
          left: triggerRect.left,
        };
      case 'top-left':
        // Above, right-aligned with button (extends left)
        return {
          top: triggerRect.top - tooltipHeight - gap,
          right: window.innerWidth - triggerRect.right,
        };
      case 'top-right':
        // Above, left-aligned with button (extends right)
        return {
          top: triggerRect.top - tooltipHeight - gap,
          left: triggerRect.left,
        };
      default:
        return { top: 0, left: 0 };
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && title && (
        <div
          className="fixed z-[9999] px-2 py-1 text-xs text-white bg-[#616161] rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={calculatePosition()}
        >
          {title}
        </div>
      )}
    </>
  );
}
