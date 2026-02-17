/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hash, MessageSquare, Search, Settings, Plus, User, Circle } from "lucide-react";

export default function Sidebar({ initialChannels, initialDMs = [], currentUser }: any) {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-full bg-[#0f0f0f] flex flex-col shrink-0 z-50">
      {/* Logo & Search */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/20">
            M
          </div>
          <span className="font-black text-white tracking-tighter text-xl">MIKXO</span>
        </div>
        
        <Link href="/search" className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 text-sm hover:bg-white/10 transition-all">
          <Search size={16} />
          <span>Hızlı Keşfet...</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        
        {/* KANALLAR (Hashtagler) */}
        <div>
          <div className="flex items-center justify-between px-2 mb-3">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">Kanallar</h3>
            <button className="text-gray-500 hover:text-white transition-colors"><Plus size={16} /></button>
          </div>
          <div className="space-y-1">
            {initialChannels.map((ch: any) => (
              <SidebarLink 
                key={ch.id}
                href={`/chat/${ch.slug}`} 
                icon={<Hash size={18} className={pathname.includes(ch.slug) ? "text-purple-400" : "text-gray-500"} />} 
                label={ch.slug} 
                isActive={pathname.includes(ch.slug)}
              />
            ))}
          </div>
        </div>

        {/* ÖZEL MESAJLAR (DM) */}
        <div>
          <div className="flex items-center justify-between px-2 mb-3">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">Mesajlar</h3>
          </div>
          <div className="space-y-1">
            {initialDMs.map((user: any) => (
              <SidebarLink 
                key={user.id}
                href={`/messages/${user.id}`} 
                icon={<div className="relative">
                  <User size={18} className="text-gray-500" />
                  <Circle size={6} className="absolute -right-0.5 -bottom-0.5 fill-green-500 text-green-500" />
                </div>} 
                label={user.name || "Anonim"} 
                isActive={pathname.includes(user.id)}
              />
            ))}
          </div>
        </div>

      </nav>

      {/* PROFİL & AYARLAR ALT BAR */}
      <div className="p-4 bg-black/20 border-t border-white/5 mt-auto">
        <Link href="/dashboard/settings" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-all group">
          <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-500/30">
            <User size={20} className="text-purple-300" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">@{currentUser?.name || "usta"}</p>
            <p className="text-[10px] text-green-500 font-medium">Aktif</p>
          </div>
          <Settings size={18} className="text-gray-500 group-hover:rotate-90 transition-transform" />
        </Link>
      </div>
    </aside>
  );
}

// Sidebar Link Yardımcısı
function SidebarLink({ href, icon, label, isActive }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
        isActive 
          ? "bg-purple-600/10 text-white shadow-[inset_0_0_20px_rgba(168,85,247,0.05)]" 
          : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
      }`}
    >
      <div className={`${isActive ? "scale-110" : "group-hover:scale-110 transition-transform"}`}>
        {icon}
      </div>
      <span className="capitalize">{label}</span>
      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]" />}
    </Link>
  );
}