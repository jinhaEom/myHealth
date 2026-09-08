import { getDb, setSyncOwner, wipeLocalData } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthState {
  hydrated: boolean;
  session: Session | null;
  user: User | null;
  isLoggedIn: boolean;
  initialize: () => void;
  logout: () => Promise<void>;
}

let initialized = false;

export const useAuthStore = create<AuthState>((set) => ({
  hydrated: false,
  session: null,
  user: null,
  isLoggedIn: false,
  initialize: () => {
    if (initialized) return;
    initialized = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, isLoggedIn: !!session, hydrated: true });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, isLoggedIn: !!session, hydrated: true });
    });
  },
  logout: async () => {
    await supabase.auth.signOut();
    wipeLocalData(getDb());
    setSyncOwner(null);
  },
}));
