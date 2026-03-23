'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';

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
  const [position, setPosition] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const gap = 8;
    const tooltipWidth = 150;
    const tooltipHeight = 24;

    switch (placement) {
      case 'top':
        setPosition({
          top: triggerRect.top - tooltipHeight - gap,
          left: triggerRect.left + (triggerRect.width - tooltipWidth) / 2,
        });
        break;
      case 'bottom':
        setPosition({
          top: triggerRect.bottom + gap,
          left: triggerRect.left + (triggerRect.width - tooltipWidth) / 2,
        });
        break;
      case 'left':
        setPosition({
          top: triggerRect.top + (triggerRect.height - tooltipHeight) / 2,
          left: triggerRect.left - tooltipWidth - gap,
        });
        break;
      case 'right':
        setPosition({
          top: triggerRect.top + (triggerRect.height - tooltipHeight) / 2,
          left: triggerRect.right + gap,
        });
        break;
      case 'bottom-left':
        setPosition({
          top: triggerRect.bottom + gap,
          right: window.innerWidth - triggerRect.right,
        });
        break;
      case 'bottom-right':
        setPosition({
          top: triggerRect.bottom + gap,
          left: triggerRect.left,
        });
        break;
      case 'top-left':
        setPosition({
          top: triggerRect.top - tooltipHeight - gap,
          right: window.innerWidth - triggerRect.right,
        });
        break;
      case 'top-right':
        setPosition({
          top: triggerRect.top - tooltipHeight - gap,
          left: triggerRect.left,
        });
        break;
      default:
        setPosition({ top: 0, left: 0 });
    }
  }, [isVisible, placement]);

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
          style={position}
        >
          {title}
        </div>
      )}
    </>
  );
}
