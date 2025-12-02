// Custom icons for crop controls

export function CropPortrait({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="7" y="2" width="10" height="20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CropLandscape({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="2" y="7" width="20" height="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CropSquare({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="4" y="4" width="16" height="16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CropFree({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      {/* Corner brackets for free crop - larger */}
      <path d="M2 8V2h6M22 8V2h-6M2 16v6h6M22 16v6h-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Rotate90DegreesRight({ className }: { className?: string}) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      {/* Arc from 90° to 360° (270° arc - three quarters) */}
      <path d="M 20 12 A 8 8 0 1 1 12 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Rotate5DegreesRight({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      {/* Arc from ~20° to 360° (340° arc - almost full circle) */}
      <path d="M 14.7 4.5 A 8 8 0 1 1 12 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}