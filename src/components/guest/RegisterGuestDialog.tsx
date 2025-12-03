'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '../Dialog';
import { TextField } from '../TextField';
import { guestsService, RegisterGuestParams } from '@/lib/api/services';
import { Guest } from '@/lib/api/types';

interface RegisterGuestDialogProps {
  open: boolean;
  onClose: () => void;
  isUpdate?: boolean;
  initialName?: string;
  initialEmail?: string;
}

export function RegisterGuestDialog({
  open,
  onClose,
  isUpdate = false,
  initialName = '',
  initialEmail = '',
}: RegisterGuestDialogProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [registered, setRegistered] = useState<Guest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setEmail(initialEmail);
      setRegistered(null);
      setError(null);
    }
  }, [open, initialName, initialEmail]);

  const handleRegister = async () => {
    setError(null);
    try {
      const params: RegisterGuestParams = { name, email };
      const result = isUpdate
        ? await guestsService.updateGuest(params)
        : await guestsService.registerGuest(params);
      setRegistered(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      // Reset to initial values on error
      if (initialEmail) setEmail(initialEmail);
      if (initialName) setName(initialName);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after closing
    setTimeout(() => {
      setRegistered(null);
      setError(null);
      setName(initialName);
      setEmail(initialEmail);
    }, 300);
  };

  // Show success message after registration/update
  if (registered) {
    if (isUpdate) {
      return (
        <Dialog
          open={open}
          onClose={handleClose}
          title="Guest Updated"
          closeText="Ok"
        >
          <p className="text-gray-900 dark:text-gray-100">
            Your guest information has been updated successfully. Your new name is <strong>{registered.name}</strong>.
          </p>
        </Dialog>
      );
    }

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        title="Check Your Email"
        closeText="Ok"
      >
        <div className="space-y-3">
          <p className="text-gray-900 dark:text-gray-100 font-medium">
            Thank you for registering, {registered.name}!
          </p>
          <p className="text-gray-900 dark:text-gray-100">
            We&apos;ve sent a verification email to <strong>{registered.email}</strong>.
          </p>
          <p className="text-gray-900 dark:text-gray-100">
            Please check your email and click the verification link to complete your registration.
          </p>
        </div>
      </Dialog>
    );
  }

  // Show error dialog
  if (error) {
    return (
      <Dialog
        open={open}
        onClose={() => {
          setError(null);
          // Keep dialog open to show the form again
        }}
        title="Error"
        closeText="Close"
      >
        <p className="text-gray-900 dark:text-gray-100">
          {error}
        </p>
      </Dialog>
    );
  }

  // Show registration form
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onOk={handleRegister}
      title={isUpdate ? "Update User" : "Register User"}
      okText="OK"
      closeText="CANCEL"
      closeOnOk={false}
    >
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        In order to be able to comment and like photos you need to register as a guest by providing
        a unique nickname and your email address. {isUpdate ? 'To update your guest information, modify the fields below.' : 'You will receive a verification email.'}
      </p>
      <div className="space-y-4">
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          disabled={isUpdate}
        />
      </div>
    </Dialog>
  );
}