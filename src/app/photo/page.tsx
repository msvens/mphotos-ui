'use client';

import { Divider } from "@/components/Divider";

export default function Photo() {
  return (
    <div className="space-y-8">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-light">Photos</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search photos..."
            className="px-4 py-2 rounded border border-mui-divider bg-transparent"
          />
          <select className="px-4 py-2 rounded border border-mui-divider bg-transparent">
            <option>Latest</option>
            <option>Oldest</option>
            <option>Most Viewed</option>
          </select>
        </div>
      </div>

      <Divider />

      {/* Photo Grid Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-mui-background-hover rounded-lg flex items-center justify-center"
          >
            <span className="text-mui-text-secondary">Photo {i + 1}</span>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <button className="px-6 py-2 border border-mui-divider rounded hover:bg-mui-background-hover transition-colors">
          Load More
        </button>
      </div>
    </div>
  );
} 