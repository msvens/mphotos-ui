'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastSeverity } from '@/components/Toast';

interface ToastItem {
  id: string;
  message: string;
  severity: ToastSeverity;
  autoHideDuration?: number;
}

interface ToastContextType {
  showToast: (message: string, severity?: ToastSeverity, autoHideDuration?: number) => void;
  success: (message: string, autoHideDuration?: number) => void;
  error: (message: string, autoHideDuration?: number) => void;
  warning: (message: string, autoHideDuration?: number) => void;
  info: (message: string, autoHideDuration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, severity: ToastSeverity = 'info', autoHideDuration = 6000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastItem = {
        id,
        message,
        severity,
        autoHideDuration,
      };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const success = useCallback(
    (message: string, autoHideDuration?: number) => {
      showToast(message, 'success', autoHideDuration);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, autoHideDuration?: number) => {
      showToast(message, 'error', autoHideDuration);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, autoHideDuration?: number) => {
      showToast(message, 'warning', autoHideDuration);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, autoHideDuration?: number) => {
      showToast(message, 'info', autoHideDuration);
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* Toast Container - Top Right */}
      <div className="fixed top-20 right-6 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              message={toast.message}
              severity={toast.severity}
              autoHideDuration={toast.autoHideDuration}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}