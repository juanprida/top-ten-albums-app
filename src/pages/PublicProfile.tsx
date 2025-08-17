import React from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { Users } from "lucide-react";

export default function PublicProfile() {
  const { username } = useParams();
  const [displayName, setDisplayName] = React.useState("");
  const [albums, setAlbums] = React.useState<
    Array<{ rank: number; title: string; artist: string; why: string }>
  >([]);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!username) return;
      const slug = String(username).toLowerCase();
      const { data: prof } = await supabase
        .from("profiles")
        .select("id,display_name")
        .eq("username", slug)
        .maybeSingle();
      if (!prof) {
        setNotFound(true);
        return;
      }
      setDisplayName(prof.display_name || slug);
      const { data: rows } = await supabase
        .from("albums")
        .select("rank,title,artist,why")
        .eq("user_id", prof.id)
        .order("rank");
      setAlbums(rows || []);
    })();
  }, [username]);
  if (notFound) return <p>User not found.</p>;
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{displayName}'s Top 10</h1>
        <Link to="/users">
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            Browse All Users
          </Button>
        </Link>
      </div>
      <Card className="border-gray-200 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">{displayName}'s Top 10</CardTitle>
        </CardHeader>
        <CardContent>
          {albums.length === 0 ? (
            <p className="text-gray-600">No albums published yet.</p>
          ) : (
            <ol className="space-y-3">
              {albums.map((a) => (
                <li key={a.rank}>
                  <div className="rounded-2xl border p-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs text-gray-700">
                        #{a.rank}
                      </span>
                      <div className="font-medium">{a.title}</div>
                      <div className="text-xs text-gray-500">— {a.artist}</div>
                    </div>
                    {a.why && (
                      <p className="mt-2 text-sm text-gray-700">{a.why}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
