'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/Button";
import { RegisterGuestDialog } from "@/components/guest/RegisterGuestDialog";
import { guestsService } from '@/lib/api/services';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { PageSpacing } from '@/components/layout/PageSpacing';

function GuestContent() {
  const searchParams = useSearchParams();
  const [showDialog, setShowDialog] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkGuest = async () => {
      try {
        const guest = await guestsService.isGuest();
        setIsGuest(guest);
        if (guest) {
          const guestData = await guestsService.getGuest();
          setGuestName(guestData.name);
          setGuestEmail(guestData.email);
        }
      } catch {
        setIsGuest(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkGuest();
  }, []);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      const verify = async () => {
        try {
          const result = await guestsService.verifyGuest(code);
          setVerified(result.verified);
          if (result.verified) {
            setIsGuest(true);
            setGuestName(result.name);
            setGuestEmail(result.email);
          }
        } catch (error) {
          alert('Error verifying guest: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      };
      verify();
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await guestsService.logoutGuest();
      setIsGuest(false);
      setGuestName('');
      setGuestEmail('');
    } catch (error) {
      alert('Error logging out: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <>
      <PageSpacing />
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        {isLoading && (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        )}

        {/* Show guest welcome and management section */}
        {!isLoading && isGuest && (
          <>
            <h1 className="text-2xl font-light text-gray-900 dark:text-white">
              {searchParams.get('code') && verified ? `Thank you for verifying, ${guestName}!` : `Welcome back, ${guestName}!`}
            </h1>

            <p className="text-gray-600 dark:text-gray-400">
              As a guest at mellowtech you can comment and like photos!
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              You are registered as <strong>{guestName}</strong> ({guestEmail})
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              Browse: <Link href="/photo" className="text-blue-600 dark:text-blue-400 hover:underline">individual Photos</Link>
              {' | '}
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">photo grid</Link>
            </p>

            <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                <strong>Manage your guest account:</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Your guest account is tied to both your name and email address. To log in again after logging out,
                you must provide the same name and email combination.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outlined"
                  onClick={() => setShowDialog(true)}
                  className="flex items-center gap-2"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  Update Guest
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                >
                  Logout Guest
                </Button>
              </div>
            </div>

            <RegisterGuestDialog
              open={showDialog}
              onClose={async () => {
                setShowDialog(false);
                // Refresh guest data after update
                try {
                  const guestData = await guestsService.getGuest();
                  setGuestName(guestData.name);
                  setGuestEmail(guestData.email);
                } catch {
                  // If fetch fails, keep existing data
                }
              }}
              isUpdate={true}
              initialName={guestName}
              initialEmail={guestEmail}
            />
          </>
        )}

        {/* Show registration page for non-guests */}
        {!isLoading && !isGuest && (
          <>
            <h1 className="text-2xl font-light text-gray-900 dark:text-white">Register Guest</h1>
            <p className="text-gray-600 dark:text-gray-400">
              In order to be able to comment and like photos you need to register as a guest by providing
              a nickname and your email address. You will get at a verification email sent to your provided
              email.
            </p>
            <div>
              <Button
                variant="outlined"
                onClick={() => setShowDialog(true)}
                className="flex items-center gap-2"
              >
                <UserPlusIcon className="h-5 w-5" />
                Register/Login
              </Button>
            </div>
            <RegisterGuestDialog
              open={showDialog}
              onClose={() => setShowDialog(false)}
            />
          </>
        )}
      </div>
    </>
  );
}

export default function Guest() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-8"><p className="text-gray-600 dark:text-gray-400">Loading...</p></div>}>
      <GuestContent />
    </Suspense>
  );
} 