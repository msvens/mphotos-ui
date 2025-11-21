'use client';

import { useState, useRef, useEffect } from 'react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  id?: string;
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
  placeholder?: string;
}

export function MultiSelect({
  id,
  label,
  value,
  onChange,
  options,
  fullWidth = false,
  margin = 'none',
  placeholder = 'Select...',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const marginClass = {
    none: '',
    dense: 'mt-2',
    normal: 'mt-4',
  }[margin];

  const widthClass = fullWidth ? 'w-full' : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  // Map selected values to their labels for display
  const selectedLabels = value
    .map((v) => options.find((opt) => opt.value === v)?.label)
    .filter((label): label is string => label !== undefined);

  const displayText = selectedLabels.length > 0
    ? selectedLabels.join(', ')
    : placeholder;

  return (
    <div ref={containerRef} className={`relative ${marginClass} ${widthClass}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs text-mui-text-secondary mb-1"
        >
          {label}
        </label>
      )}

      {/* Select trigger */}
      <div
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${widthClass}
          px-3 py-2
          bg-transparent
          border border-mui-divider
          rounded
          text-mui-text-primary
          focus:outline-none
          focus:border-mui-primary
          hover:border-mui-text-primary
          cursor-pointer
          min-h-[42px]
          flex items-center justify-between
        `}
      >
        <span className={value.length === 0 ? 'text-mui-text-disabled' : ''}>
          {displayText}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-[#424242] border border-mui-divider rounded shadow-lg max-h-[220px] overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className="flex items-center px-3 py-2 hover:bg-mui-background-hover cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => {}} // Handled by parent div onClick
                className="mr-3 h-4 w-4 accent-mui-primary cursor-pointer"
              />
              <span className="text-mui-text-primary text-sm">
                {option.label}
              </span>
            </div>
          ))}
          {options.length === 0 && (
            <div className="px-3 py-2 text-mui-text-disabled text-sm">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
}