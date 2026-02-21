"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Group {
  id: string;
  name: string;
  description: string | null;
  avatarUrl: string | null;
}

export default function GroupsPage() {
  const [groupsList, setGroupsList] = useState<Group[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch("/api/groups")
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (active) setGroupsList(data); });
    return () => { active = false; };
  }, []);

  async function createGroup() {
    if (!name.trim()) return;
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    if (res.ok) {
      setShowModal(false);
      setName("");
      setDescription("");
      const r = await fetch("/api/groups");
      if (r.ok) setGroupsList(await r.json());
    }
  }

  return (
    <div className="flex flex-col h-full bg-neutral-800 text-white">
      <div className="flex items-center justify-between p-4 border-b border-neutral-700">
        <h1 className="text-xl font-bold">👥 Groups</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-sm"
        >
          + Create
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {groupsList.length === 0 && (
          <p className="text-neutral-400 text-sm p-3">No groups yet. Create one!</p>
        )}
        {groupsList.map((g) => (
          <button
            key={g.id}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-700 text-left"
            onClick={() => router.push(`/dashboard/groups/${g.id}`)}
          >
            <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center text-lg">
              {g.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.avatarUrl} alt={g.name} className="w-full h-full object-cover rounded-full" />
              ) : "👥"}
            </div>
            <div>
              <p className="font-medium">{g.name}</p>
              {g.description && <p className="text-sm text-neutral-400">{g.description}</p>}
            </div>
          </button>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold">Create Group</h2>
            <input
              className="w-full bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
              placeholder="Group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
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
