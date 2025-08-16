'use client';

import { Divider } from "@/components/Divider";

export function GoogleDrive() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-light mb-4">Google Drive</h1>
        <p className="text-mui-text-secondary">Manage Google Drive integration</p>
      </div>

      <Divider />

      <div className="space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <p className="text-blue-600 text-center">
            Google Drive integration settings will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}
