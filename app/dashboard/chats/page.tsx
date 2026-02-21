"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; username: string | null; displayName: string | null; avatarUrl: string | null }[]
  >([]);
  const router = useRouter();

  async function search(q: string) {
    setQuery(q);
    if (!q.trim()) { setResults([]); return; }
    const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
    if (res.ok) setResults(await res.json());
  }

  return (
    <div className="flex flex-col h-full bg-neutral-800 text-white">
      <div className="p-4 border-b border-neutral-700">
        <h1 className="text-xl font-bold mb-3">💬 Chats</h1>
        <input
          className="w-full bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
          placeholder="Search users..."
          value={query}
          onChange={(e) => search(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {results.length === 0 && query && (
          <p className="text-neutral-400 text-sm p-3">No users found.</p>
        )}
        {results.length === 0 && !query && (
          <p className="text-neutral-400 text-sm p-3">Search for a user to start a chat.</p>
        )}
        {results.map((u) => (
          <button
            key={u.id}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-700 text-left"
            onClick={() => router.push(`/dashboard/chats/${u.id}`)}
          >
            <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center text-lg overflow-hidden">
              {u.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={u.avatarUrl} alt={u.username ?? ""} className="w-full h-full object-cover" />
              ) : (
                "👤"
              )}
            </div>
            <div>
              <p className="font-medium">{u.displayName ?? u.username}</p>
              <p className="text-sm text-neutral-400">@{u.username}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
