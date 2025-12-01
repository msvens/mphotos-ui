'use client';

import { Divider } from "@/components/Divider";

export default function Resume() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light mb-4">Resume</h1>
        <p className="text-gray-600 dark:text-gray-400">Software Engineer & Photography Enthusiast</p>
      </div>

      <Divider />

      {/* Experience Section */}
      <section>
        <h2 className="text-2xl font-light mb-6">Professional Experience</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium">Senior Software Engineer</h3>
            <p className="text-gray-600 dark:text-gray-400">Company Name • 2020 - Present</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2 space-y-1">
              <li>Led development of key features</li>
              <li>Mentored junior developers</li>
              <li>Implemented modern web technologies</li>
            </ul>
          </div>
        </div>
      </section>

      <Divider />

      {/* Skills Section */}
      <section>
        <h2 className="text-2xl font-light mb-6">Technical Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium mb-2">Languages</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li>TypeScript</li>
              <li>Python</li>
              <li>Java</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Frontend</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li>React</li>
              <li>Next.js</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Other</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li>Git</li>
              <li>Docker</li>
              <li>AWS</li>
            </ul>
          </div>
        </div>
      </section>

      <Divider />

      {/* Education Section */}
      <section>
        <h2 className="text-2xl font-light mb-6">Education</h2>
        <div>
          <h3 className="text-xl font-medium">Master of Science in Computer Science</h3>
          <p className="text-gray-600 dark:text-gray-400">University Name • 2018</p>
        </div>
      </section>
    </div>
  );
} 