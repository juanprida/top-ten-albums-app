import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp, Plus, Save, Trash2, User, Users } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { Input, Textarea, Badge } from '@/components/Input';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/Toast';
type Album = { id: string; title: string; artist: string; why: string };
type Profile = { name: string; albums: Album[] };
const MAX_ALBUMS = 10;
const STORAGE_KEY = 'top10albums:v3';
function useLocalStorage<T>(k: string, init: T) {
  const [s, ss] = useState<T>(() => {
    try {
      const r = localStorage.getItem(k);
      return r ? (JSON.parse(r) as T) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(k, JSON.stringify(s));
    } catch {}
  }, [k, s]);
  return [s, ss] as const;
}
function slugify(input: string) {
  return (input || 'me')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
async function ensureAuth() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error('Not signed in');
  return data.session.user;
}
export default function AppEditor() {
  const [profile, setProfile] = useLocalStorage<Profile>(STORAGE_KEY, {
    name: '',
    albums: [],
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const { push } = useToast();
  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user ?? null;
      setCurrentUser(user);
      if (!user) {
        setLoading(false);
        return;
      }
      const { data: prof } = await supabase
        .from('profiles')
        .select('username,display_name')
        .eq('id', user.id)
        .maybeSingle();
      if (prof) {
        setProfile((p) => ({ ...p, name: prof.display_name || p.name }));
      }
      const { data: rows } = await supabase
        .from('albums')
        .select('rank,title,artist,why')
        .eq('user_id', user.id)
        .order('rank');
      if (rows && rows.length) {
        setProfile((p) => ({
          ...p,
          albums: rows.map((r) => ({
            id: crypto.randomUUID(),
            title: r.title,
            artist: r.artist,
            why: r.why,
          })),
        }));
      }
      setLoading(false);
    })();
  }, []);
  function addBlank() {
    if (profile.albums.length >= MAX_ALBUMS) return;
    setProfile({
      ...profile,
      albums: [
        ...profile.albums,
        { id: crypto.randomUUID(), title: '', artist: '', why: '' },
      ],
    });
  }
  function updateAlbum(i: number, p: Partial<Album>) {
    setProfile({
      ...profile,
      albums: profile.albums.map((a, idx) => (idx === i ? { ...a, ...p } : a)),
    });
  }
  function move(i: number, d: number) {
    const j = i + d;
    if (j < 0 || j >= profile.albums.length) return;
    const n = [...profile.albums];
    [n[i], n[j]] = [n[j], n[i]];
    setProfile({ ...profile, albums: n });
  }
  function removeAt(i: number) {
    setProfile({
      ...profile,
      albums: profile.albums.filter((_, idx) => idx !== i),
    });
  }
  function clearAll() {
    setProfile({ name: profile.name, albums: [] });
    push('Cleared.');
  }
  async function save() {
    try {
      const user = await ensureAuth();
      const uname = slugify(profile.name);
      if (!profile.albums.length) {
        push('Add at least one album.');
        return;
      }
      const rows = profile.albums.map((a, i) => ({
        user_id: user.id,
        rank: i + 1,
        title: a.title,
        artist: a.artist,
        why: a.why,
      }));
      const up = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: uname,
          display_name: profile.name || uname,
        })
        .select()
        .single();
      if (up.error) {
        console.error(up.error);
        push("Couldn't save profile.");
        return;
      }
      await supabase.from('albums').delete().eq('user_id', user.id);
      if (rows.length) {
        const ins = await supabase.from('albums').insert(rows);
        if (ins.error) {
          console.error(ins.error);
          push("Couldn't save albums.");
          return;
        }
      }
      push('Published!');
      nav(`/user/${uname}`);
    } catch {
      push('Please sign in to publish.');
    }
  }
  if (loading) return <p>Loading...</p>;
  if (!currentUser) {
    return (
      <Card className="border-gray-200 shadow-none">
        <CardContent className="py-8">
          <h2 className="text-xl font-semibold mb-2">Sign in</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter your email and we’ll send you a magic link.
          </p>
          <EmailSignIn
            onSubmit={(email) => {
              supabase.auth
                .signInWithOtp({
                  email,
                  options: { emailRedirectTo: window.location.origin + '/app' },
                })
                .then(() => push('Check your email for a sign-in link.'));
            }}
          />
        </CardContent>
      </Card>
    );
  }
  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-300">
            <User className="h-5 w-5" />
          </div>
          <Input
            className="w-80"
            placeholder="Your name (used for your public page)"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2">
          <Link to="/users">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" /> Browse Users
            </Button>
          </Link>
          <Button onClick={addBlank} className="gap-2">
            <Plus className="h-4 w-4" /> Add album ({profile.albums.length}/
            {MAX_ALBUMS})
          </Button>
          <Button variant="outline" onClick={clearAll} className="gap-2">
            <Trash2 className="h-4 w-4" /> Clear
          </Button>
          <Button onClick={save} className="gap-2">
            <Save className="h-4 w-4" /> Save & Publish
          </Button>
        </div>
      </div>
      {profile.albums.length === 0 ? (
        <Card className="border border-gray-200 shadow-none bg-white text-gray-900">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200">
              <User className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">No albums yet</h3>
            <p className="mt-1 text-gray-500">
              Add up to ten albums and a short note about why you love each one.
            </p>
            <Button onClick={addBlank} className="mt-6">
              Add your first album
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ol className="space-y-3">
          <AnimatePresence>
            {profile.albums.map((album, idx) => (
              <motion.li
                key={album.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <Card className="border-gray-200 shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                      <Badge className="px-3 py-1">#{idx + 1}</Badge>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Album title"
                          value={album.title}
                          onChange={(e) =>
                            updateAlbum(idx, { title: e.target.value })
                          }
                          className="w-56"
                        />
                        <Input
                          placeholder="Artist"
                          value={album.artist}
                          onChange={(e) =>
                            updateAlbum(idx, { artist: e.target.value })
                          }
                          className="w-48"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => move(idx, -1)}
                        disabled={idx === 0}
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => move(idx, +1)}
                        disabled={idx === profile.albums.length - 1}
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeAt(idx)}
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Why this album matters to you (optional)"
                      value={album.why}
                      onChange={(e) =>
                        updateAlbum(idx, { why: e.target.value })
                      }
                    />
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}
    </div>
  );
}
function EmailSignIn({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(email);
      }}
    >
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
        />
        <Button type="submit">Send link</Button>
      </div>
    </form>
  );
}
