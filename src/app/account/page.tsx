'use client';

import { Divider } from "@/components/Divider";
import { Button } from "@/components/Button";

export default function Account() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-light mb-4">Account Settings</h1>
        <p className="text-mui-text-secondary">Manage your profile and preferences</p>
      </div>

      <Divider />

      {/* Profile Section */}
      <section>
        <h2 className="text-xl font-light mb-6">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-mui-divider bg-transparent"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              className="w-full p-2 rounded border border-mui-divider bg-transparent"
              rows={3}
              placeholder="Tell us about yourself"
            />
          </div>
          <div>
            <Button variant="primary">Update Profile</Button>
          </div>
        </div>
      </section>

      <Divider />

      {/* Preferences Section */}
      <section>
        <h2 className="text-xl font-light mb-6">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <input type="checkbox" className="form-checkbox" />
          </div>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <input type="checkbox" className="form-checkbox" checked readOnly />
          </div>
        </div>
      </section>

      <Divider />

      {/* Danger Zone */}
      <section>
        <h2 className="text-xl font-light mb-6 text-red-500">Danger Zone</h2>
        <div>
          <Button variant="secondary">Delete Account</Button>
        </div>
      </section>
    </div>
  );
} 