'use client';

import { useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Add keyframes for slide-in animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
  `;
  if (!document.head.querySelector('style[data-toast-animations]')) {
    style.setAttribute('data-toast-animations', 'true');
    document.head.appendChild(style);
  }
}

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  severity?: ToastSeverity;
  autoHideDuration?: number;
  onClose: (id: string) => void;
}

const severityConfig = {
  success: {
    bg: 'bg-blue-600', // Tailwind blue
    icon: CheckCircleIcon,
    iconColor: 'text-white',
  },
  error: {
    bg: 'bg-red-600', // Tailwind red
    icon: ExclamationCircleIcon,
    iconColor: 'text-white',
  },
  warning: {
    bg: 'bg-orange-600', // Tailwind orange
    icon: ExclamationTriangleIcon,
    iconColor: 'text-white',
  },
  info: {
    bg: 'bg-blue-600', // Tailwind blue
    icon: InformationCircleIcon,
    iconColor: 'text-white',
  },
};

export function Toast({
  id,
  message,
  severity = 'info',
  autoHideDuration = 6000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (autoHideDuration && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [id, autoHideDuration, onClose]);

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bg} text-white px-4 py-3 rounded shadow-xl flex items-center gap-3 min-w-[288px] max-w-[568px]`}
      style={{ animation: 'slideIn 0.3s ease-out' }}
    >
      <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0`} />
      <div className="flex-1 text-sm">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="text-white hover:text-gray-300 transition-colors flex-shrink-0 pointer-events-auto cursor-pointer"
        aria-label="Close"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}