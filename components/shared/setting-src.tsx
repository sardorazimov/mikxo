/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { User, Shield, Link as LinkIcon, Bell, Camera, Image as ImageIcon } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <h1 className="text-3xl font-black mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
        Hesap Ayarları
      </h1>

      <div className="flex gap-8">
        {/* Sol Menü - Tab Seçimi */}
        <aside className="w-48 space-y-2">
          <TabButton id="profile" icon={<User size={18}/>} label="Profil" active={activeTab} onClick={setActiveTab} />
          <TabButton id="security" icon={<Shield size={18}/>} label="Güvenlik" active={activeTab} onClick={setActiveTab} />
          <TabButton id="socials" icon={<LinkIcon size={18}/>} label="Sosyal Linkler" active={activeTab} onClick={setActiveTab} />
          <TabButton id="notifications" icon={<Bell size={18}/>} label="Bildirimler" active={activeTab} onClick={setActiveTab} />
        </aside>

        {/* Sağ Alan - İçerik */}
        <main className="flex-1 space-y-12">
          
          {/* 1. Profil & Görsel Alanı (Avatar & Banner) */}
          <section className="space-y-6">
            <div className="relative group">
              {/* Banner Alanı */}
              <div className="h-40 w-full bg-gradient-to-r from-purple-900 to-blue-900 rounded-3xl overflow-hidden relative">
                 <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-sm font-medium">
                   <ImageIcon size={20} /> Banner Değiştir
                 </button>
              </div>
              
              {/* Avatar Alanı */}
              <div className="absolute -bottom-6 left-8">
                <div className="relative w-24 h-24 rounded-full border-4 border-[#0a0a0a] bg-gray-800 overflow-hidden group/avatar">
                  <button className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={20} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Form Alanları */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              <InputGroup label="Kullanıcı Adı" placeholder="@usta_yazilimci" />
              <InputGroup label="Display Name" placeholder="Mikxo Usta" />
            </div>
            <div className="space-y-2">
               <label className="text-xs text-gray-500 font-bold uppercase">Bio</label>
               <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-purple-500 outline-none transition-all h-24" placeholder="Kendinden bahset..." />
            </div>
          </section>

          {/* 2. Sosyal Linkler & Doğum Tarihi */}
          <section className="bg-white/5 rounded-3xl p-6 space-y-4">
             <h3 className="font-bold">Ekstra Bilgiler</h3>
             <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Doğum Tarihi" type="date" />
                <InputGroup label="Instagram URL" placeholder="instagram.com/..." />
             </div>
          </section>

          {/* Kaydet Butonu */}
          <div className="flex justify-end">
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-purple-500 hover:text-white transition-all">
               Değişiklikleri Kaydet
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}

// Yardımcı Bileşenler
function TabButton({ id, icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${active === id ? 'bg-white/10 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
    >
      {icon} {label}
    </button>
  );
}

function InputGroup({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-gray-500 font-bold uppercase">{label}</label>
      <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-purple-500 outline-none transition-all" {...props} />
    </div>
  );
}