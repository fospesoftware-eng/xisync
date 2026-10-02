import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth as useReplitAuth } from '@workspace/replit-auth-web';
import type { AuthUser } from '@workspace/replit-auth-web';
import { apiRequest } from './xisync-api';
import type { Profile, Tenant } from './xisync-types';

type WorkspaceContext = { profile: Profile; tenant: Tenant };
type AuthContextType = {
  user: AuthUser | null;
  profile: Profile | null;
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
  signIn: () => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useReplitAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    if (!auth.user) {
      setProfile(null);
      setTenant(null);
      return;
    }
    setWorkspaceLoading(true);
    setError(null);
    try {
      const context = await apiRequest<WorkspaceContext>('/api/xisync/context');
      setProfile(context.profile);
      setTenant(context.tenant);
    } catch (cause) {
      setProfile(null);
      setTenant(null);
      setError(cause instanceof Error ? cause.message : 'Unable to load your XiSync workspace.');
    } finally {
      setWorkspaceLoading(false);
    }
  };

  useEffect(() => {
    if (auth.isLoading) return;
    if (!auth.user) {
      setProfile(null);
      setTenant(null);
      setError(null);
      setWorkspaceLoading(false);
      return;
    }
    void refreshProfile();
  }, [auth.isLoading, auth.user?.id]);

  const signOut = async () => {
    auth.logout();
  };

  return (
    <AuthContext.Provider value={{
      user: auth.user,
      profile,
      tenant,
      loading: auth.isLoading || workspaceLoading,
      error,
      signIn: auth.login,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}