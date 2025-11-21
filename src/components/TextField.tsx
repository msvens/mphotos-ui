'use client';

import { ChangeEvent } from 'react';

export interface TextFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  margin?: 'none' | 'dense' | 'normal';
  placeholder?: string;
  type?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  fullWidth = false,
  multiline = false,
  rows = 1,
  margin = 'none',
  placeholder,
  type = 'text',
}: TextFieldProps) {
  const marginClass = {
    none: '',
    dense: 'mt-2',
    normal: 'mt-4',
  }[margin];

  const widthClass = fullWidth ? 'w-full' : '';

  const baseInputClasses = `
    px-3 py-2
    bg-transparent
    border border-mui-divider
    rounded
    text-mui-text-primary
    placeholder:text-mui-text-secondary
    focus:outline-none
    focus:border-mui-primary-main
    hover:border-mui-text-primary
    ${widthClass}
  `;

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
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className={`${baseInputClasses} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseInputClasses}
        />
      )}
    </div>
  );
}