import React, { createContext, useContext, useState, useEffect } from 'react';

interface PasswordContextType {
  isUnlocked: boolean;
  unlockApp: (password: string) => boolean;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

const CORRECT_PASSWORD = 'Fospe@7561';
const PASSWORD_STORAGE_KEY = 'app_unlocked';

export function PasswordProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PASSWORD_STORAGE_KEY);
    if (stored === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const unlockApp = (password: string) => {
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(PASSWORD_STORAGE_KEY, 'true');
      setIsUnlocked(true);
      return true;
    }
    return false;
  };

  return (
    <PasswordContext.Provider value={{ isUnlocked, unlockApp }}>
      {children}
    </PasswordContext.Provider>
  );
}

export function usePassword() {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error('usePassword must be used within PasswordProvider');
  }
  return context;
}
