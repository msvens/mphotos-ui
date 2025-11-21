'use client';

import { ReactNode } from 'react';
import { Button } from './Button';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  onOk?: () => void | Promise<void>;
  closeText?: string;
  okText?: string;
  closeOnOk?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  children?: ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  text,
  onOk,
  closeText = 'CANCEL',
  okText = 'OK',
  closeOnOk = true,
  maxWidth = 'md',
  children,
}: DialogProps) {
  if (!open) return null;

  const handleOk = async () => {
    if (onOk) {
      await onOk();
    }
    if (closeOnOk) {
      onClose();
    }
  };

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`relative bg-[#424242] rounded ${maxWidthClass} w-full mx-4 shadow-lg`}
      >
        {/* Title */}
        {title && (
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-xl font-normal text-mui-text-primary">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-4">
          {text && (
            <p className="text-sm text-mui-text-secondary mb-4">{text}</p>
          )}
          {children}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-mui-divider">
          <Button variant="text" onClick={onClose}>
            {closeText}
          </Button>
          {onOk && (
            <Button variant="text" onClick={handleOk}>
              {okText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}