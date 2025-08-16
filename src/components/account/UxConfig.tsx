'use client';

import { Divider } from "@/components/Divider";

export function UxConfig() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-light mb-4">UX Configuration</h1>
        <p className="text-mui-text-secondary">Customize your user experience</p>
      </div>

      <Divider />

      <div className="space-y-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
          <p className="text-green-600 text-center">
            User experience configuration settings will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}
