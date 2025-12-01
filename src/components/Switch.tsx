'use client';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-14 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer
          peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
          peer-checked:after:border-white after:content-[''] after:absolute
          after:top-[-6px] after:start-[-2px] after:bg-white after:border-gray-300
          after:border-2 after:rounded-full after:h-8 after:w-8 after:transition-all
          after:shadow-sm peer-checked:bg-blue-500 peer-checked:after:border-blue-500"></div>
      </div>
      {label && <span className="ml-4 text-base">{label}</span>}
    </label>
  );
} 