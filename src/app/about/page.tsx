'use client';

import { Paragraph } from '@/components/Paragraph';
import Link from 'next/link';
import { PageSpacing } from '@/components/layout/PageSpacing';
import { Logo } from '@/components/Logo';

export default function AboutPage() {
  return (
    <>
      <PageSpacing />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="w-[200px] mx-auto mb-12">
          <Logo />
        </div>

        <Paragraph>
          Mellowtech Photos is my personal photoblog. It also serves as the homepage for mellowtech (
          <Link href="#mellowtech" className="text-blue-600 dark:text-blue-400 hover:underline">see below</Link>
          ). There are a lot of photo blogs out there - instagram, flickr, photobucket, etc. None, however did
          what I exactly wanted. Namely to
        </Paragraph>

        <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
          <li>Take full advantage of exif information stored typically in your jpegs</li>
          <li>All editing (including meta information) done in lightroom</li>
          <li>Offer a tight integration with Google Drive</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Technical Detail</h2>

        <Paragraph>
          This website uses Go for the backend and React/Next.js as its frontend. You can find the code
          in the following projects
        </Paragraph>

        <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
          <li>
            <Link href="https://github.com/msvens/mphotos" className="text-blue-600 dark:text-blue-400 hover:underline">
              mphotos
            </Link>{' '}
            - backend service
          </li>
          <li>
            <Link href="https://github.com/msvens/mphotos-ui" className="text-blue-600 dark:text-blue-400 hover:underline">
              mphotos-ui
            </Link>{' '}
            - Next.js frontend
          </li>
          <li>
            <Link href="https://github.com/msvens/mdrive" className="text-blue-600 dark:text-blue-400 hover:underline">
              mdrive
            </Link>{' '}
            - simplified google drive access
          </li>
          <li>
            <Link href="https://github.com/msvens/mexif" className="text-blue-600 dark:text-blue-400 hover:underline">
              mexif
            </Link>{' '}
            - extract exif information from images
          </li>
        </ul>

        <Paragraph>
          The frontend is built using:
        </Paragraph>

        <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
          <li>
            <Link href="https://nextjs.org" className="text-blue-600 dark:text-blue-400 hover:underline">
              Next.js 15
            </Link>{' '}
            with App Router
          </li>
          <li>
            <Link href="https://react.dev" className="text-blue-600 dark:text-blue-400 hover:underline">
              React 19
            </Link>
          </li>
          <li>
            <Link href="https://www.typescriptlang.org" className="text-blue-600 dark:text-blue-400 hover:underline">
              TypeScript
            </Link>
          </li>
          <li>
            <Link href="https://tailwindcss.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              Tailwind CSS
            </Link>
          </li>
          <li>
            <Link href="https://heroicons.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              Heroicons
            </Link>
          </li>
        </ul>

        <Paragraph>
          A big thanks to the following libraries and tools that made this project possible:
        </Paragraph>

        <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
          <li>
            <Link href="https://exiftool.org" className="text-blue-600 dark:text-blue-400 hover:underline">
              exiftool
            </Link>
          </li>
          <li>
            <Link href="https://libvips.github.io/libvips/API/current/Using-vipsthumbnail.md.html" className="text-blue-600 dark:text-blue-400 hover:underline">
              libvips
            </Link>
          </li>
          <li>
            <Link href="https://github.com/gorilla/mux" className="text-blue-600 dark:text-blue-400 hover:underline">
              gorilla mux
            </Link>
          </li>
          <li>
            <Link href="https://github.com/gorilla/sessions" className="text-blue-600 dark:text-blue-400 hover:underline">
              gorilla sessions
            </Link>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4" id="mellowtech">Mellowtech</h2>

        <Paragraph>
          mellowtech came into existence back in 2002 when Martin Svensson and Rickard Cöster (then 2 phd
          studends) decided to start a software company. A great deal of time was spent on finding a good
          name, in the end we ended up with mellow - we thought it captured what we were about. A lot of
          relaxing and at the same time producing solid (actually another name we had in mind) and mature
          code. As with many other grand ideas running a company while doing your phd did not turn out to be
          the best of ideas, especially since we mostly wanted to create cool stuff.
        </Paragraph>

        <Paragraph>
          In the end one the company died but the idea of mellowtech prevailed. It has been a playground for
          fiddling with things such as, disc based search and sort, key-value stores, social graphs, oauth &
          openid and blog sofware. Some of it has lived for a very long time while other stuff have been
          developed recently.
        </Paragraph>
      </div>
    </>
  );
}