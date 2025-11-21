'use client';

import { ChangeEvent, ReactNode } from 'react';

export interface SelectProps {
  id?: string;
  label?: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
  children: ReactNode;
}

export function Select({
  id,
  label,
  value,
  onChange,
  fullWidth = false,
  margin = 'none',
  children,
}: SelectProps) {
  const marginClass = {
    none: '',
    dense: 'mt-2',
    normal: 'mt-4',
  }[margin];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`${marginClass} ${widthClass}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs text-mui-text-secondary mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`
          ${widthClass}
          px-3 py-2
          bg-transparent
          border border-mui-divider
          rounded
          text-mui-text-primary
          focus:outline-none
          focus:border-mui-primary-main
          hover:border-mui-text-primary
          cursor-pointer
        `}
      >
        {children}
      </select>
    </div>
  );
}