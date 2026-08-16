import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, type Profile, type Tenant } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  tenant: Tenant | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData as Profile);

      if (profileData.tenant_id) {
        const { data: tenantData } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', profileData.tenant_id)
          .maybeSingle();

        if (tenantData) {
          setTenant(tenantData as Tenant);
        }
      }
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    // Safety timeout: Ensure loading state resolves smoothly within 300ms
    const safetyTimeout = setTimeout(() => {
      if (isSubscribed) {
        setLoading(false);
      }
    }, 300);

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isSubscribed) return;
        setSession(session);
        setUser((prev) => prev ?? session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isSubscribed) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isSubscribed) return;
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      isSubscribed = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const demoEmails = ['admin@xisync.com', 'demo@exportco.com', 'buyer@abccorp.com'];
    const cleanEmail = email.toLowerCase().trim();

    if (demoEmails.includes(cleanEmail)) {
      // Mock demo user session
      const mockUser = {
        id: cleanEmail === 'admin@xisync.com' ? 'demo-admin-id' : cleanEmail === 'buyer@abccorp.com' ? 'demo-buyer-id' : 'demo-exporter-id',
        email: cleanEmail,
        user_metadata: { full_name: cleanEmail === 'admin@xisync.com' ? 'SaaS Admin' : cleanEmail === 'buyer@abccorp.com' ? 'ABC Buyer' : 'Exporter Admin' },
      } as unknown as User;

      setUser(mockUser);
      setProfile({
        id: mockUser.id,
        tenant_id: 'demo-tenant-id',
        full_name: mockUser.user_metadata.full_name,
        full_name_cn: null,
        phone: null,
        avatar_url: null,
        role: cleanEmail === 'admin@xisync.com' ? 'super_admin' : cleanEmail === 'buyer@abccorp.com' ? 'viewer' : 'admin',
        language: 'en',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Profile);
      setLoading(false);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (!error && data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        role: 'admin',
      });
    }

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setTenant(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        tenant,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
