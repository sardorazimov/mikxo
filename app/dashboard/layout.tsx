// src/app/dashboard/layout.tsx
import { db } from "@/db";
import { getSession } from "@/lib/auth";

import { redirect } from "next/navigation";
import { channels } from "../../db/schema";
import Sidebar from "../../components/shared/sidebar";
import Header from "../../components/layout/layoutheader";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // 1. Kanalları ve DM'leri (Kullanıcıları) paralel çekelim
  const dbChannels = await db.select().from(channels).limit(10);
  
  // Şimdilik hata almamak için boş dizi gönderiyoruz, 
  // ileride burayı mesajlaştığın kişilere bağlarsın.
  const dbDMs: never[] = []; 

  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, session.userId),
  });

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <Sidebar 
        initialChannels={dbChannels || []} // undefined gelirse patlamasın diye []
        initialDMs={dbDMs || []}           // İşte hatayı çözen kritik satır!
        currentUser={currentUser} 
      />

      <div className="flex flex-col flex-1 min-w-0 border-l border-white/5 relative">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          {children}
        </main>
      </div>
    </div>
  );
}