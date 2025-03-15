'use client';

import { Divider } from "@/components/Divider";
import { Button } from "@/components/Button";

export default function Album() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-light">Albums</h1>
        <Button variant="primary">Create Album</Button>
      </div>

      <Divider />

      {/* Album Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="group cursor-pointer">
            {/* Album Cover */}
            <div className="aspect-square bg-mui-background-hover rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-mui-text-secondary">Album {i + 1}</span>
              </div>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white">View Album</span>
              </div>
            </div>
            {/* Album Info */}
            <div className="mt-2">
              <h3 className="font-medium">Album Title {i + 1}</h3>
              <p className="text-sm text-mui-text-secondary">12 photos • Updated 2 days ago</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (hidden when there are albums) */}
      <div className="hidden text-center py-12">
        <h3 className="text-xl font-light mb-4">No Albums Yet</h3>
        <p className="text-mui-text-secondary mb-6">Create your first album to organize your photos</p>
        <Button variant="primary">Create Your First Album</Button>
      </div>
    </div>
  );
} 