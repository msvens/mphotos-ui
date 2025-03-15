'use client';

import { Divider } from "@/components/Divider";
import { Button } from "@/components/Button";

export default function Guest() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-light mb-4">Guest Book</h1>
        <p className="text-mui-text-secondary">Leave a message or comment</p>
      </div>

      <Divider />

      {/* New Message Form */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-xl font-light mb-6">Write a Message</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-mui-divider bg-transparent"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              className="w-full p-2 rounded border border-mui-divider bg-transparent"
              rows={4}
              placeholder="Write your message here..."
            />
          </div>
          <div>
            <Button variant="primary">Post Message</Button>
          </div>
        </form>
      </section>

      <Divider />

      {/* Messages List */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-light mb-6">Recent Messages</h2>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border border-mui-divider rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Guest Name {i + 1}</h3>
                <span className="text-sm text-mui-text-secondary">2 days ago</span>
              </div>
              <p className="text-mui-text-secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Load More */}
      <div className="text-center">
        <Button>Load More Messages</Button>
      </div>
    </div>
  );
} 