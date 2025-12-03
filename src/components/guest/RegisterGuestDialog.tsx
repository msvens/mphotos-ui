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
    if (initialName) setName(initialName);
    if (initialEmail) setEmail(initialEmail);
  }, [initialName, initialEmail]);

  const handleRegister = async () => {
    setError(null);
    try {
      const params: RegisterGuestParams = { name, email };
      const result = await guestsService.registerGuest(params);
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

  // Show success message after registration
  if (registered) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        title=""
        closeText="Ok"
      >
        <p className="text-gray-900 dark:text-gray-100">
          Thank you for registering {registered.name}. Don&apos;t forget to verify your email with
          Mellowtech by clicking the link in the email we just sent to {registered.email}.
        </p>
      </Dialog>
    );
  }

  // Show error dialog
  if (error) {
    return (
      <Dialog
        open={open}
        onClose={() => setError(null)}
        title=""
        closeText="Close"
      >
        <p className="text-gray-900 dark:text-gray-100">
          Error: {error}
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
    >
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        In order to be able to comment and like photos you need to register as a guest by providing
        a nickname and your email address. To update your nickname you can simply register the same
        email with a different name
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
        />
      </div>
    </Dialog>
  );
}