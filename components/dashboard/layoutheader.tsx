/* eslint-disable react-hooks/set-state-in-effect */
// src/components/layout/Header.tsx
"use client";

import { usePathname, useParams } from "next/navigation";
import { Hash, Settings, Users, Search, Info } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const params = useParams(); // URL'deki [channelId] vb. yakalar
  const [title, setTitle] = useState("");

  useEffect(() => {
    // 1. URL'ye göre Başlık Belirleme
    if (params.channelId) {
      // Eğer bir kanaldaysak (Örn: /chat/yazilim)
      setTitle(params.channelId as string);
    } else if (pathname === "/settings") {
      setTitle("Hesap Ayarları");
    } else if (pathname === "/search") {
      setTitle("Keşfet");
    } else if (pathname === "/messages") {
      setTitle("Direkt Mesajlar");
    } else {
      setTitle("");
    }
  }, [pathname, params]);

  return (
    <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {/* İkon Dinamik Değişir */}
        <div className="">
          {params.channelId ? (
            <Hash className="w-5 h-5 text-purple-500" />
          ) : (
              <Link href={"/"}>
                <img src="/logo.png" alt="Mikxo Logo"  className="w-20"/>
              </Link>
          )}
        </div>
        
        <div>
          <h1 className="text-white font-bold text-base leading-none capitalize">
            {title}
          </h1>
          {params.channelId && (
            <p className="text-[10px] text-gray-500 mt-1">
              Topluluk kanalı • #trending
            </p>
          )}
        </div>
      </div>

      {/* Sağ Taraf - Aksiyon Butonları */}
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors">
          <Search size={20} />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Info size={20} />
        </button>
        <div className="w-[1px] h-6 bg-white/10 mx-2" />
        <div className="flex -space-x-2">
           {/* Aktif kullanıcıların küçük avatarları gelebilir */}
           <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-[#0a0a0a]" />
           <div className="w-7 h-7 rounded-full bg-gray-600 border-2 border-[#0a0a0a]" />
        </div>
      </div>
    </header>
  );
}