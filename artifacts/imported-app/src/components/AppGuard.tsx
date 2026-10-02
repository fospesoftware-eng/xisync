import React from 'react';
import { isSupabaseConfigured } from '../lib/supabase';

export function AppGuard({ children }: { children: React.ReactNode }) {
  return <>
    {!isSupabaseConfigured && (
      <div role="status" className="fixed bottom-0 inset-x-0 z-[100] bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 border-t border-amber-200">
        Preview mode: live sign-in and database features are not connected. Public pages and the original demo accounts remain available.
      </div>
    )}
    {children}
  </>;
}

