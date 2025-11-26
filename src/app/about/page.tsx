'use client';

import { Divider } from "@/components/Divider";
import { Paragraph } from '@/components/Paragraph';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-light mb-4">About Mellowtech Photos</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A modern, self-hosted photo gallery that helps you organize and share your photos.
        </p>
      </div>

      <Divider spacing={{ top: 8, bottom: 12 }} />

      <Paragraph>
        Built with a focus on simplicity and performance, it provides a clean interface for browsing and 
        managing your photo collection.
      </Paragraph>

      <Paragraph>
        The project consists of two main components:
      </Paragraph>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
        <li>
          <Link href="https://github.com/msvens/mphotos" className="text-blue-600 dark:text-blue-400 hover:underline">
            mphotos-server
          </Link>{' '}
          - A Go-based backend that handles photo storage, organization, 
          and serving. It provides a RESTful API for managing photos and albums.
        </li>
        <li>
          <Link href="https://github.com/msvens/mphotos-app" className="text-blue-600 dark:text-blue-400 hover:underline">
            mphotos-ui
          </Link>{' '}
          - A modern Next.js-based frontend that provides a responsive and 
          intuitive user interface for interacting with your photo collection.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Technical Details</h2>

      <Paragraph>
        The frontend is built using modern web technologies:
      </Paragraph>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
        <li>
          <Link href="https://nextjs.org" className="text-blue-600 dark:text-blue-400 hover:underline">
            Next.js 14
          </Link>{' '}
          with App Router for server-side rendering and routing
        </li>
        <li>
          <Link href="https://www.typescriptlang.org" className="text-blue-600 dark:text-blue-400 hover:underline">
            TypeScript
          </Link>{' '}
          for type safety and better developer experience
        </li>
        <li>
          <Link href="https://tailwindcss.com" className="text-blue-600 dark:text-blue-400 hover:underline">
            Tailwind CSS
          </Link>{' '}
          for styling and responsive design
        </li>
        <li>
          <Link href="https://tanstack.com/query/latest" className="text-blue-600 dark:text-blue-400 hover:underline">
            React Query
          </Link>{' '}
          for efficient data fetching and caching
        </li>
        <li>
          <Link href="https://github.com/pmndrs/zustand" className="text-blue-600 dark:text-blue-400 hover:underline">
            Zustand
          </Link>{' '}
          for state management
        </li>
      </ul>

      <Paragraph>
        The backend is written in Go and provides:
      </Paragraph>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
        <li>RESTful API with OpenAPI/Swagger documentation</li>
        <li>Efficient photo storage and caching</li>
        <li>Support for various image formats and metadata</li>
        <li>Album organization and management</li>
        <li>User authentication and authorization</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Features</h2>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
        <li>Responsive grid layout for photo browsing</li>
        <li>Light and dark mode support</li>
        <li>Photo metadata display and editing</li>
        <li>Album organization and management</li>
        <li>Search and filtering capabilities</li>
        <li>Share functionality for photos and albums</li>
        <li>Keyboard navigation support</li>
      </ul>

      <Paragraph>
        mphotos is designed to be self-hosted, giving you full control over your photo collection
        and data. It&apos;s perfect for individuals and families who want to maintain their own photo
        gallery without relying on third-party services.
      </Paragraph>

      <h2 className="text-2xl font-semibold mt-8 mb-4">About Mellowtech</h2>

      <Paragraph>
        Mellowtech is a collection of open-source projects focused on creating efficient and user-friendly 
        tools for managing digital content. Our projects are designed to be self-hosted, giving users 
        full control over their data and privacy.
      </Paragraph>

      <Paragraph>
        Other Mellowtech projects include:
      </Paragraph>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
        <li>
          <Link href="https://github.com/msvens/mexif" className="text-blue-600 dark:text-blue-400 hover:underline">
            mexif
          </Link>{' '}
          - A Go library for reading and writing EXIF metadata
        </li>
        <li>
          <Link href="https://github.com/msvens/mdrive" className="text-blue-600 dark:text-blue-400 hover:underline">
            mdrive
          </Link>{' '}
          - A Google Drive client library for Go
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Acknowledgments</h2>

      <Paragraph>
        This project would not be possible without the following open-source software:
      </Paragraph>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
        <li>
          <Link href="https://exiftool.org" className="text-blue-600 dark:text-blue-400 hover:underline">
            ExifTool
          </Link>{' '}
          - For reading and writing image metadata
        </li>
        <li>
          <Link href="https://github.com/disintegration/imaging" className="text-blue-600 dark:text-blue-400 hover:underline">
            imaging
          </Link>{' '}
          - For image processing and resizing
        </li>
        <li>
          <Link href="https://github.com/rwcarlsen/goexif" className="text-blue-600 dark:text-blue-400 hover:underline">
            goexif
          </Link>{' '}
          - For EXIF metadata handling in Go
        </li>
        <li>
          <Link href="https://github.com/gorilla/mux" className="text-blue-600 dark:text-blue-400 hover:underline">
            Gorilla Mux
          </Link>{' '}
          - For HTTP routing and middleware
        </li>
        <li>
          <Link href="https://github.com/gorilla/sessions" className="text-blue-600 dark:text-blue-400 hover:underline">
            Gorilla Sessions
          </Link>{' '}
          - For session management
        </li>
      </ul>
    </div>
  );
} 