// Public pages and the original demo accounts do not require a live database.
// Never report a successful database operation when its connection is missing.
export const connectionError = new Error(
  'Live sign-in and database features are unavailable. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect your existing Supabase project.',
);

export function createUnavailableSupabase() {
  const failure = () => Promise.resolve({ data: null, error: connectionError });
  const query: unknown = new Proxy({}, {
    get(_target, property) {
      if (property === 'then') {
        const result = failure();
        return result.then.bind(result);
      }
      return () => query;
    },
  });

  return {
    from: () => query,
    auth: {
      getSession: async () => ({ data: { session: null }, error: connectionError }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } },
      }),
      signInWithPassword: failure,
      signUp: async () => ({ data: { user: null, session: null }, error: connectionError }),
      signOut: failure,
    },
  };
}