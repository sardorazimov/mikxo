"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Channel {
  id: string;
  slug: string;
  description: string | null;
}

export default function ChannelsPage() {
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch("/api/channels")
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (active) setChannelList(data); });
    return () => { active = false; };
  }, []);

  async function createChannel() {
    if (!slug.trim()) return;
    const res = await fetch("/api/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, description, isPrivate: false }),
    });
    if (res.ok) {
      setShowCreate(false);
      setSlug("");
      setDescription("");
      const r = await fetch("/api/channels");
      if (r.ok) setChannelList(await r.json());
    }
  }

  return (
    <div className="flex flex-col h-full bg-neutral-800 text-white">
      <div className="flex items-center justify-between p-4 border-b border-neutral-700">
        <h1 className="text-xl font-bold"># Channels</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-sm"
        >
          + Create
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {channelList.length === 0 && (
          <p className="text-neutral-400 text-sm p-3">No channels yet.</p>
        )}
        {channelList.map((c) => (
          <button
            key={c.id}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-700 text-left"
            onClick={() => router.push(`/dashboard/channels/${c.id}`)}
          >
            <span className="text-neutral-400 font-bold">#</span>
            <div>
              <p className="font-medium">{c.slug}</p>
              {c.description && <p className="text-sm text-neutral-400">{c.description}</p>}
            </div>
          </button>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold">Create Channel</h2>
            <input
              className="w-full bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
              placeholder="Channel slug (e.g. general)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <input
              className="w-full bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={createChannel}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
