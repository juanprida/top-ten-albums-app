import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { Users, Music, ExternalLink } from 'lucide-react';

type UserProfile = {
  id: string;
  username: string;
  display_name: string;
  albums: Array<{
    rank: number;
    title: string;
    artist: string;
    why: string;
  }>;
};

export default function AllUsers() {
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchAllUsers() {
      try {
        setLoading(true);
        
        // Fetch all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, display_name')
          .order('display_name');
        
        if (profilesError) throw profilesError;
        
        // Fetch albums for each user
        const usersWithAlbums = await Promise.all(
          profiles.map(async (profile) => {
            const { data: albums } = await supabase
              .from('albums')
              .select('rank, title, artist, why')
              .eq('user_id', profile.id)
              .order('rank');
            
            return {
              id: profile.id,
              username: profile.username,
              display_name: profile.display_name || profile.username,
              albums: albums || [],
            };
          })
        );
        
        setUsers(usersWithAlbums);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchAllUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200">
            <Users className="h-6 w-6 animate-pulse" />
          </div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-8 text-center">
          <p className="text-red-700">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const usersWithAlbums = users.filter(user => user.albums.length > 0);
  const usersWithoutAlbums = users.filter(user => user.albums.length === 0);

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-700 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">All Users</span>
      </div>
      
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-gray-200 bg-white">
          <Users className="h-8 w-8 text-gray-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
        <p className="mt-2 text-gray-600">
          Discover everyone's top 10 albums and musical preferences
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Music className="h-4 w-4" />
            {usersWithAlbums.length} users with lists
          </span>
          <span className="mt-4 flex items-center gap-1">
            <Users className="h-4 w-4" />
            {users.length} total users
          </span>
        </div>
        <div className="mt-6">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Users with albums */}
      {usersWithAlbums.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Users with Published Lists
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {usersWithAlbums.map((user) => (
              <Card key={user.id} className="border-gray-200 hover:border-gray-300 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="truncate">{user.display_name}</span>
                    <Link 
                      to={`/user/${user.username}`}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="View full profile"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {user.albums.slice(0, 3).map((album) => (
                      <div key={album.rank} className="flex items-start gap-2 text-sm">
                        <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs text-gray-700 font-medium">
                          #{album.rank}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">{album.title}</div>
                          <div className="text-xs text-gray-500 truncate">— {album.artist}</div>
                        </div>
                      </div>
                    ))}
                    {user.albums.length > 3 && (
                      <div className="text-xs text-gray-500 pt-1">
                        +{user.albums.length - 3} more albums
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link 
                      to={`/user/${user.username}`}
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full text-sm">
                        View Full List
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Users without albums */}
      {usersWithoutAlbums.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Users Without Lists
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {usersWithoutAlbums.map((user) => (
              <Card key={user.id} className="border-gray-200 bg-gray-50">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{user.display_name}</span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      No albums
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {users.length === 0 && (
        <Card className="border-gray-200 shadow-none">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">No users found</h3>
            <p className="mt-1 text-gray-500">
              Be the first to create your top 10 albums list!
            </p>
            <Link to="/app" className="inline-block mt-6">
              <Button>Create My List</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
