import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { Users } from 'lucide-react';
export default function Root() {
  const [user, setUser] = React.useState<any>(null);
  const nav = useNavigate();
  React.useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setUser(s?.user ?? null)
    );
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);
  async function signOut() {
    await supabase.auth.signOut();
    nav('/');
  }
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-300">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">
              Top 10 Albums
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/app">
                  <Button variant="outline">My list</Button>
                </Link>
                <Button onClick={signOut}>Sign out</Button>
              </>
            ) : (
              <Link to="/app">
                <Button>Start</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-5xl px-4 pb-8 pt-4 text-xs text-gray-400">
        <span>Minimal design • white / gray / black • no distractions</span>
      </footer>
    </div>
  );
}
