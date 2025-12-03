'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/Button";
import { RegisterGuestDialog } from "@/components/guest/RegisterGuestDialog";
import { guestsService } from '@/lib/api/services';
import { UserPlusIcon } from '@heroicons/react/24/outline';

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

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  // Show verification success message
  if (searchParams.get('code') && verified && isGuest) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <h1 className="text-2xl font-light text-gray-900 dark:text-white">Thank you for verifying!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          As a guest at mellowtech you can comment and like photos!
          <br />
          You are registered as:
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>Name</strong>: {guestName}</li>
          <li><strong>Email</strong>: {guestEmail}</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-400">
          Continue to <Link href="/photo" className="text-blue-600 dark:text-blue-400 hover:underline">individual Photos</Link>
          <br />
          Continue to <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">photo grid</Link>
        </p>
      </div>
    );
  }

  // Show welcome back message if already a guest
  if (!searchParams.get('code') && isGuest) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <h1 className="text-2xl font-light text-gray-900 dark:text-white">Welcome back {guestName}!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          If you want to update your name or register a new Guest you can do so from here by clicking the update button below.
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Your guest account is tied to your email address and as long as you register with the same email you can change your name.
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          If you want to register/sign in with a different user make sure to use a different name and email.
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
        <RegisterGuestDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          isUpdate={true}
          initialName={guestName}
          initialEmail={guestEmail}
        />
      </div>
    );
  }

  // Show registration page for non-guests
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
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
          REGISTER GUEST
        </Button>
      </div>
      <RegisterGuestDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </div>
  );
}

export default function Guest() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-8"><p className="text-gray-600 dark:text-gray-400">Loading...</p></div>}>
      <GuestContent />
    </Suspense>
  );
} 