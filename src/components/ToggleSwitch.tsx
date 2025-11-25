'use client';

export interface ToggleSwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function ToggleSwitch({ id, checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label id={id} className="flex items-center gap-3 cursor-pointer">
      <div
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-500' : 'bg-gray-600'
        }`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      {label && <span className="text-mui-text-primary">{label}</span>}
    </label>
  );
}