"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

interface Message {
  id: string;
  senderId: string;
  content: string | null;
  createdAt: string;
}

interface ChannelInfo {
  id: string;
  slug: string;
  description: string | null;
  creatorId: string | null;
}

export default function ChannelPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function loadChannel() {
    fetch(`/api/channels/${channelId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setChannel(data);
          setEditSlug(data.slug);
          setEditDescription(data.description ?? "");
        }
      });
  }

  useEffect(() => {
    let active = true;
    fetch("/api/user")
      .then(r => r.json())
      .then(u => { if (active) setCurrentUserId(u?.id ?? null); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    loadChannel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  useEffect(() => {
    let active = true;
    const poll = () =>
      fetch(`/api/messages?channelId=${channelId}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (active && data) setMessages(data); });
    poll();
    const interval = setInterval(poll, 3000);
    return () => { active = false; clearInterval(interval); };
  }, [channelId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!text.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, channelId }),
    });
    setText("");
    const res = await fetch(`/api/messages?channelId=${channelId}`);
    if (res.ok) setMessages(await res.json());
  }

  async function saveSettings() {
    const res = await fetch(`/api/channels/${channelId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: editSlug, description: editDescription }),
    });
    if (res.ok) {
      loadChannel();
      setShowSettings(false);
    }
  }

  async function deleteChannel() {
    const res = await fetch(`/api/channels/${channelId}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard/channels");
  }

  const isCreator = channel?.creatorId === currentUserId;

  return (
    <div className="flex flex-col h-full bg-neutral-800 text-white">
      <div className="flex items-center justify-between p-4 border-b border-neutral-700">
        <h1 className="font-bold text-lg"># {channel?.slug ?? "Channel"}</h1>
        <button
          onClick={() => setShowSettings(true)}
          className="bg-neutral-700 hover:bg-neutral-600 px-3 py-1 rounded-lg text-sm"
        >
          ⚙️ Settings
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.senderId === currentUserId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                m.senderId === currentUserId ? "bg-indigo-600" : "bg-neutral-700"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t border-neutral-700 flex gap-2">
        <input
          className="flex-1 bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium"
        >
          Send
        </button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-md space-y-5 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Channel Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-neutral-400 hover:text-white text-xl">✕</button>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Slug</p>
              <input
                className={`w-full bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none ${!isCreator ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="channel-slug"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                readOnly={!isCreator}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Description</p>
              <input
                className={`w-full bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none ${!isCreator ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="Description (optional)"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                readOnly={!isCreator}
              />
            </div>

            {isCreator && (
              <button
                onClick={saveSettings}
                className="w-full bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Save Changes
              </button>
            )}

            {isCreator && (
              <div className="border-t border-neutral-700 pt-4">
                <button
                  onClick={deleteChannel}
                  className="w-full bg-red-900 hover:bg-red-800 px-4 py-2 rounded-lg text-sm text-red-300"
                >
                  Delete Channel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
