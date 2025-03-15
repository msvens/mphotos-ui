'use client';

import { Divider } from "@/components/Divider";

export default function Camera() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light mb-4">Camera Equipment</h1>
        <p className="text-mui-text-secondary">My photography gear and settings</p>
      </div>

      <Divider />

      {/* Camera Bodies */}
      <section>
        <h2 className="text-2xl font-light mb-6">Camera Bodies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-mui-divider rounded-lg">
            <h3 className="font-medium mb-2">Sony A7 IV</h3>
            <ul className="text-mui-text-secondary space-y-1">
              <li>• Full-frame 33MP sensor</li>
              <li>• 4K 60p video</li>
              <li>• 5-axis stabilization</li>
            </ul>
          </div>
          <div className="p-4 border border-mui-divider rounded-lg">
            <h3 className="font-medium mb-2">Fujifilm X100V</h3>
            <ul className="text-mui-text-secondary space-y-1">
              <li>• APS-C 26.1MP sensor</li>
              <li>• Fixed 23mm f/2 lens</li>
              <li>• Weather resistant</li>
            </ul>
          </div>
        </div>
      </section>

      <Divider />

      {/* Lenses */}
      <section>
        <h2 className="text-xl font-light mb-6">Favorite Lenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-mui-divider rounded-lg">
            <h3 className="font-medium mb-2">Sony 24-70mm f/2.8</h3>
            <p className="text-mui-text-secondary">Versatile zoom lens for everyday shooting</p>
          </div>
          <div className="p-4 border border-mui-divider rounded-lg">
            <h3 className="font-medium mb-2">Sony 85mm f/1.4</h3>
            <p className="text-mui-text-secondary">Perfect for portraits and bokeh</p>
          </div>
          <div className="p-4 border border-mui-divider rounded-lg">
            <h3 className="font-medium mb-2">Sony 16-35mm f/2.8</h3>
            <p className="text-mui-text-secondary">Wide-angle for landscapes</p>
          </div>
        </div>
      </section>

      <Divider />

      {/* Other Equipment */}
      <section>
        <h2 className="text-xl font-light mb-6">Other Equipment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-mui-divider rounded-lg">
            <h3 className="font-medium mb-2">Tripods & Support</h3>
            <ul className="text-mui-text-secondary space-y-1">
              <li>• Peak Design Travel Tripod</li>
              <li>• DJI RSC 2 Gimbal</li>
            </ul>
          </div>
          <div className="p-4 border border-mui-divider rounded-lg">
            <h3 className="font-medium mb-2">Accessories</h3>
            <ul className="text-mui-text-secondary space-y-1">
              <li>• Filters: ND & Polarizing</li>
              <li>• Camera Bags</li>
              <li>• Memory Cards</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
} 