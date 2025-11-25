'use client';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
}

export function RadioGroup({ id, label, value, onChange, options }: RadioGroupProps) {
  return (
    <div id={id}>
      {label && (
        <div className="text-mui-text-secondary text-sm mb-2">{label}</div>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                value === option.value ? 'border-blue-500' : 'border-gray-500'
              }`}
              onClick={() => onChange(option.value)}
            >
              {value === option.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              )}
            </div>
            <span className="text-mui-text-primary">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}