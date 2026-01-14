import React from 'react';
import { usePassword } from '../lib/password-context';
import { PasswordModal } from './PasswordModal';

export function AppGuard({ children }: { children: React.ReactNode }) {
  const { isUnlocked } = usePassword();

  if (!isUnlocked) {
    return <PasswordModal />;
  }

  return <>{children}</>;
}
