import React from 'react';
export function AppGuard({ children }: { children: React.ReactNode }) {
  return <>
    <div role="status" className="fixed bottom-0 inset-x-0 z-[100] bg-slate-900/90 px-4 py-2 text-center text-xs text-white">
      Public pages are open. Sign in to access your private XiSync workspace and saved data.
    </div>
    {children}
  </>;
}

