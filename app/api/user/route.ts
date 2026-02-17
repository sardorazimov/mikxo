import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq, and, ne } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    // 1. Yetki Kontrolü
    if (!session || !session.userId) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const { username } = await req.json();

    // 2. Basit Validation (Küçük harf, rakam ve alt tireye izin verelim)
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { message: "Kullanıcı adı 3-15 karakter olmalı ve özel karakter içermemeli (sadece _)" },
        { status: 400 }
      );
    }

    // 3. Benzersizlik Kontrolü (Aynı username başkasında var mı?)
    const existingUser = await db.query.users.findFirst({
      where: and(
        eq(users.username, username.toLowerCase()),
        ne(users.id, session.userId) // Kendisi hariç başkasında var mı?
      ),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu kullanıcı adı zaten alınmış, usta!" },
        { status: 400 }
      );
    }

    // 4. Veritabanını Güncelle
    await db
      .update(users)
      .set({ username: username.toLowerCase() })
      .where(eq(users.id, session.userId));

    return NextResponse.json({ message: "Kullanıcı adı başarıyla güncellendi." });

  } catch (error) {
    console.error("[UPDATE_USERNAME_ERROR]:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu" }, { status: 500 });
  }
}