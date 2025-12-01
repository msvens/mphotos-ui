'use client';

import { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
  placeholder?: string;
}

export function Select({
  id,
  label,
  value,
  onChange,
  options,
  fullWidth = false,
  margin = 'none',
  placeholder = 'Select...',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const marginClass = {
    none: '',
    dense: 'mt-2',
    normal: 'mt-4',
  }[margin];

  const widthClass = fullWidth ? 'w-full' : '';

  // Find the label for the current value
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`${marginClass} ${widthClass}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs text-gray-600 dark:text-gray-400 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {/* Select trigger */}
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            ${widthClass}
            pl-3 pr-10 py-2
            bg-transparent
            border border-gray-200 dark:border-gray-700
            rounded
            text-gray-900 dark:text-white
            text-left
            focus:outline-none
            focus:border-blue-500
            hover:border-gray-900 dark:hover:border-white
            cursor-pointer
          `}
        >
          {displayText}
        </button>

        {/* Dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#424242] border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  px-3 py-2 cursor-pointer
                  ${option.value === value
                    ? 'bg-gray-600 text-white'
                    : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {option.label}
              </div>
            ))}
            {options.length === 0 && (
              <div className="px-3 py-2 text-gray-600 dark:text-gray-400">
                No options available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}